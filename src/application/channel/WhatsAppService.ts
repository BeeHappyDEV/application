import {injectable} from 'tsyringe';

import pino from 'pino';

import {Boom} from '@hapi/boom';
import {Browsers, DisconnectReason, fetchLatestBaileysVersion, makeWASocket, useMultiFileAuthState} from 'baileys';

@injectable ()
export class WhatsAppService {

    private initializedBoolean = false;
    private numberString: string = '';
    private logger: any;
    private connectionPromise: Promise<void> | null = null;
    private qrCode: string = '';

    private sock: any | null;

    constructor (
        //@inject ('LogToolFactory') private logToolFactory: () => LogTool
    ) {
        this.logger = pino ({level: 'silent'});
        this.logger = pino ({level: 'info'});
    }

    public async initialize (instanceRecord: Record<string, any>): Promise<void> {

        this.numberString = instanceRecord.numberString;

        if (this.initializedBoolean) {

            return;

        }

        try {

            await this.execute ();

            this.initializedBoolean = true;

        } catch (error) {

            this.initializedBoolean = false;

        }

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    private async execute (): Promise<void> {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = (async () => {
            try {
                const authDir = `auth_${this.numberString}`;
                const {state, saveCreds} = await useMultiFileAuthState (authDir);
                const {version} = await fetchLatestBaileysVersion ();

                this.sock = makeWASocket ({
                    logger: this.logger,
                    version,
                    auth: state,
                    browser: Browsers.ubuntu ('Chrome'),
                    connectTimeoutMs: 60000
                });

                // Configurar manejadores de eventos
                this.setupEventHandlers (saveCreds);

                // Esperar a que la conexión se establezca
                await new Promise<void> ((resolve, reject) => {
                    const timeout = setTimeout (() => {
                        reject (new Error (`Timeout de conexión para ${this.numberString}`));
                    }, 120000); // 2 minutos timeout

                    this.sock.ev.on ('connection.update', (update: { connection: any }) => {
                        if (update.connection === 'open') {
                            clearTimeout (timeout);
                            this.qrCode = '';
                            resolve ();
                        }
                    });
                });

                this.initializedBoolean = true;
                this.logger.info (`✅ Conexión exitosa para: ${this.numberString}`);

            } catch (error) {
                this.initializedBoolean = false;
                this.connectionPromise = null;
                this.logger.error (`❌ Error en execute() para ${this.numberString}:`, error);
                throw error;
            }
        }) ();

        return this.connectionPromise;
    }

    private setupEventHandlers(saveCreds: () => Promise<void>): void {
        // Manejador de actualización de conexión (INCLUYENDO QR)
        this.sock.ev.on('connection.update', (update: {
            connection: any;
            lastDisconnect?: { error?: Boom };
            qr?: string;
        }) => {
            const {connection, lastDisconnect, qr} = update;

            // ✅ MANEJO MANUAL DEL QR CODE
            if (qr) {
                this.qrCode = qr;
                this.logger.info(`📱 QR Code para ${this.numberString}:`);
                this.logger.info(qr); // Esto mostrará el QR en texto
                this.logger.info('Escanea el código QR con WhatsApp → Linked Devices');
            }

            this.logger.debug(`Conexión update para ${this.numberString}:`, connection);

            if (connection === 'close') {
                this.initializedBoolean = false;
                const boomError = lastDisconnect?.error as Boom;
                const shouldReconnect = boomError?.output?.statusCode !== DisconnectReason.loggedOut;

                this.logger.warn(`Conexión cerrada para ${this.numberString}, reconectando: ${shouldReconnect}`);

                if (shouldReconnect) {
                    setTimeout(() => {
                        this.connectionPromise = null;
                        this.execute().catch(error => {
                            this.logger.error(`Error en reconexión automática: ${error}`);
                        });
                    }, 5000);
                }
            } else if (connection === 'open') {
                this.initializedBoolean = true;
                this.qrCode = ''; // Limpiar QR cuando se conecta
                this.logger.info(`✅ Conectado a WhatsApp para: ${this.numberString}`);
            }
        });

        // Manejador de actualización de credenciales
        this.sock.ev.on('creds.update', saveCreds);

        // Configurar manejador de mensajes
        this.sock.ev.on('messages.upsert', this.handleMessages.bind(this));
    }

    private async handleMessages (m: { messages: any[] }): Promise<void> {
        try {
            const message = m.messages[0];

            // Ignorar mensajes propios y mensajes sin contenido
            if (message.key.fromMe || !message.message) {
                return;
            }

            const from = message.key.remoteJid;
            const messageType = Object.keys (message.message)[0];
            const senderNumber = from.split ('@')[0];

            this.logger.info (`📨 Mensaje recibido de ${senderNumber}: ${messageType}`);

            switch (messageType) {
                case 'conversation':
                    const text = message.message.conversation;
                    await this.processTextMessage (senderNumber, text);
                    break;

                case 'extendedTextMessage':
                    const extendedText = message.message.extendedTextMessage.text;
                    await this.processTextMessage (senderNumber, extendedText);
                    break;

                case 'stickerMessage':
                    await this.processStickerMessage (senderNumber, message);
                    break;

                case 'imageMessage':
                    await this.processMediaMessage (senderNumber, 'image');
                    break;

                default:
                    this.logger.debug (`Tipo de mensaje no procesado: ${messageType}`);
            }
        } catch (error) {
            this.logger.error ('Error en handleMessages:', error);
        }
    }

    private async processTextMessage (senderNumber: string, text: string): Promise<void> {
        this.logger.info (`Procesando texto de ${senderNumber}: ${text}`);

        if (text.toLowerCase () === 'hola') {
            await this.sendMessage (senderNumber + '@s.whatsapp.net', '¡Hola! ¿Cómo estás?');
        }
    }

    private async processStickerMessage (senderNumber: string, message: {
        message: { stickerMessage: any }
    }): Promise<void> {
        const stickerInfo = message.message.stickerMessage;
        this.logger.info (`Sticker recibido de ${senderNumber}`, {
            mimetype: stickerInfo.mimetype,
            fileSize: stickerInfo.fileLength
        });

        await this.sendMessage (senderNumber + '@s.whatsapp.net', '¡Qué buen sticker! 😊');
    }

    private async processMediaMessage (senderNumber: string, mediaType: string): Promise<void> {
        this.logger.info (`${mediaType} recibido de ${senderNumber}`);
    }

    private async sendMessage (jid: string, text: string): Promise<void> {
        try {
            await this.sock.sendMessage (jid, {text: text});
            this.logger.info (`✅ Mensaje enviado a: ${jid}`);
        } catch (error) {
            this.logger.error (`Error enviando mensaje a ${jid}:`, error);
        }
    }

    // Método para cerrar la conexión
    public async disconnect (): Promise<void> {
        if (this.sock) {
            this.sock.ws.close ();
            this.initializedBoolean = false;
            this.connectionPromise = null;
            this.logger.info (`🔌 Conexión cerrada para: ${this.numberString}`);
        }
    }
}