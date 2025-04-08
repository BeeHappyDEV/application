class UtilsTool {

    public static async getRequestIdentifier (lengthInteger: Number) {

        let charsString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let uint8Array = new Uint8Array (lengthInteger.valueOf ());

        crypto.getRandomValues (uint8Array);

        return Array.from (uint8Array).map (byte => charsString [byte % charsString.length]).join ("");

    }

}

export default UtilsTool;