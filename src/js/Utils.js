class Utils {

    static async sleep(millis) {
        return await new Promise((resolve, reject) => setTimeout(resolve, millis));
    }

    static bytesToHex(uint8Array) {
        return Array.from(uint8Array).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    static async copyToClipboard(text) {

        // make sure copy to clipboard is supported
        if(!navigator.clipboard || !navigator.clipboard.writeText){
            alert("Clipboard not supported. Site must be served via https on iOS.");
            return;
        }

        // copy value to clipboard
        await navigator.clipboard.writeText(text);

        // tell user we copied it
        alert("Copied to clipboard!");

    }

    static isUint8ArrayEqual(a, b) {

        // ensure they are the same length
        if(a.length !== b.length){
            return false;
        }

        // ensure each item is the same
        for(let i = 0; i < a.length; i++){
            if(a[i] !== b[i]){
                return false;
            }
        }

        // arrays are equal
        return true;

    }

    static getBatteryPercentage(millivolts) {

        const minVoltage = 3400; // show battery as 0% at or below this value
        const maxVoltage = 4200; // show battery as 100% at or above this value

        // 0% if at or below min voltage
        if(millivolts <= minVoltage){
            return 0;
        }

        // 100% if at or above max voltage
        if(millivolts >= maxVoltage){
            return 100;
        }

        // linear calculation
        // todo implement curve based voltage to percentage calculations
        return Math.floor(((millivolts - minVoltage) / (maxVoltage - minVoltage)) * 100);

    }

}

export default Utils;
