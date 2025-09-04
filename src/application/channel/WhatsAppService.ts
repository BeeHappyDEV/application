import {injectable} from 'tsyringe';

import {
    default as makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers
} from 'baileys';
import {Boom} from '@hapi/boom';

@injectable ()
export class WhatsAppService {

    private initializedBoolean = false;

    private sock: any | null;
    private numberSet: Set<string> = new Set ();
    private assignedPhone: string = '';
    private isConnected: boolean = false;

    constructor (
        //@inject ('LogToolFactory') private logToolFactory: () => LogTool
    ) {
    }

    public async initialize (phoneString: string): Promise<void> {

        this.numberSet.add (phoneString);
        this.assignedPhone = phoneString;

        if (this.initializedBoolean) {

            return;

        }

        try {

            this.initializedBoolean = true;

        } catch (error) {

            this.initializedBoolean = false;

        }

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    public async connect (): Promise<void> {
        console.log ();
        if (this.isConnected) {
            return;
        }

        try {
            const {state, saveCreds} = await useMultiFileAuthState (`auth_${this.assignedPhone}`);
            const {version} = await fetchLatestBaileysVersion ();

            this.sock = makeWASocket ({
                version,
                auth: state,
                browser: Browsers.ubuntu ('Chrome')
            });

            // Manejar eventos de conexión
            this.sock.ev.on ('connection.update', (update: { connection: any; lastDisconnect?: { error?: Boom } }) => {

                const {connection, lastDisconnect} = update;

                if (connection === 'close') {

                    this.isConnected = false;

                    const boomError = lastDisconnect?.error as Boom;

                    const shouldReconnect = boomError?.output?.statusCode !== DisconnectReason.loggedOut;

                    console.log (`Conexión cerrada para ${this.assignedPhone}, reconectando:`, shouldReconnect);

                    if (shouldReconnect) {

                        setTimeout (() => this.connect (), 5000);

                    }

                } else if (connection === 'open') {

                    this.isConnected = true;

                    console.log (`✅ Conectado a WhatsApp para: ${this.assignedPhone}`);

                }

            });

            this.sock.ev.on ('creds.update', saveCreds);

            await this.setupMessageHandler ();

        } catch (error) {

            console.error (`Error conectando para ${this.assignedPhone}:`, error);

            this.isConnected = false;

            throw error;

        }

    }

    private async setupMessageHandler () {

        this.sock.ev.on ('messages.upsert', async (m: { messages: any [] }): Promise<void> => {

            const message = m.messages [0];

            // Ignorar mensajes propios y mensajes sin contenido
            if (message.key.fromMe || !message.message) {

                return;

            }

            // Extraer información del mensaje
            const from = message.key.remoteJid;
            const messageType = Object.keys (message.message) [0];
            const senderNumber = from.split ('@') [0];

            console.log ('📨 Mensaje recibido de:', senderNumber);
            console.log ('Tipo de mensaje:', messageType);

            // Procesar diferentes tipos de mensajes
            switch (messageType) {
                case 'conversation': // Mensaje de texto simple
                    const text = message.message.conversation;
                    console.log ('Texto recibido:', text);
                    await this.processTextMessage (senderNumber, text);
                    break;

                case 'extendedTextMessage': // Mensaje de texto extendido
                    const extendedText = message.message.extendedTextMessage.text;
                    console.log ('Texto extendido:', extendedText);
                    await this.processTextMessage (senderNumber, extendedText);
                    break;

                case 'stickerMessage': // Sticker
                    console.log ('Sticker recibido');
                    await this.processStickerMessage (senderNumber, message);
                    break;

                case 'imageMessage': // Imagen
                    console.log ('Imagen recibida');
                    await this.processMediaMessage (senderNumber, 'image');
                    break;

                default:
                    console.log ('Tipo de mensaje no procesado:', messageType);
            }
        });
    }

    private async processTextMessage (senderNumber: string, text: string) {
        console.log (`Procesando texto de ${senderNumber}: ${text}`);

        // Ejemplo: responder automáticamente
        if (text.toLowerCase () === 'hola') {
            await this.sendMessage (senderNumber + '@s.whatsapp.net', '¡Hola! ¿Cómo estás?');
        }

        // Verificar si el número está registrado
        if (await this.isNumberRegistered (senderNumber)) {
            console.log ('Número registrado detectado');
            // Tu lógica para números registrados
        }
    }

    private async processStickerMessage (senderNumber: string, message: { message: { stickerMessage: any } }) {
        console.log (`Sticker recibido de ${senderNumber}`);

        const stickerInfo = message.message.stickerMessage;
        console.log ('Info del sticker:', {
            mimetype: stickerInfo.mimetype,
            fileSize: stickerInfo.fileLength
        });

        await this.sendMessage (senderNumber + '@s.whatsapp.net', '¡Qué buen sticker! 😊');
    }

    private async processMediaMessage (senderNumber: string, mediaType: string) {
        console.log (`${mediaType} recibido de ${senderNumber}`);
    }

    private async sendMessage (jid: string, text: string) {
        try {
            await this.sock.sendMessage (jid, {text: text});
            console.log ('✅ Mensaje enviado a:', jid);
        } catch (error) {
            console.error ('Error enviando mensaje:', error);
        }
    }

    private async isNumberRegistered (number: string): Promise<boolean> {
        const cleanNumber = number.replace (/\D/g, '');
        return this.numberSet.has (cleanNumber);
    }

}