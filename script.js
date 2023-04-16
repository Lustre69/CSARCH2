function convert() {
    // Get input values
    let dec = document.getElementById("dec").value;
    let rounding = document.getElementById("rounding").value;
    let output = document.getElementById("output").value;

    // Convert dec to bin
    dec = dec.replace(/x/i, '*');  // Replace "x" with "*"
    dec = dec.replace(/\^/i, '**'); // Replace "^" with "**"
    dec = eval(dec);  // Evaluate the expression
    let bin = decimalToBinary(dec, rounding);

    // Convert bin to hexadecimal
    let hexadecimal = binaryToHexadecimal(bin);

    // Output the result
    let result = "";
    if (output === "bin") {
        result = bin;
    } else if (output === "hexadecimal") {
        result = hexadecimal;
    }

    // Display result
    document.getElementById("result").value = result;
}

function convertandsave() {
    // Get input values
    let dec = document.getElementById("dec").value;
    let rounding = document.getElementById("rounding").value;
    let output = document.getElementById("output").value;

    // Convert dec to bin
    dec = dec.replace(/x/i, '*');  // Replace "x" with "*"
    dec = dec.replace(/\^/i, '**'); // Replace "^" with "**"
    dec = eval(dec);  // Evaluate the expression
    let bin = decimalToBinary(dec, rounding);

    // Convert bin to hexadecimal
    let hexadecimal = binaryToHexadecimal(bin);

    // Output the result
    let result = "";
    if (output === "bin") {
        result = bin;
    } else if (output === "hexadecimal") {
        result = hexadecimal;
    }

    // Display result
    document.getElementById("result").value = result;

    saveToFile(result, "IEEE-754.txt");

}

function decimalToBinary(dec, rounding) {
    if (isNaN(dec)) {
        return "NaN";
    }
    
    let sign = "+";
    if (dec < 0) {
        sign = "-";
        dec = -dec;
    }

    let exponent = Math.floor(Math.log2(dec));
    let mantissa = dec / Math.pow(2, exponent) - 1;

    if (exponent === -Infinity) {
        // Negative infinity denormalized
        exponent = 0;
        mantissa = 0.5;
        sign = "-";
    } else if (exponent < -1022) {
        // Subnormal
        exponent = 0;
        mantissa *= Math.pow(2, 1022);
    } else if (exponent >= 1024) {
        // Infinity
        exponent = 2047;
        mantissa = 0;
    } else {
        // Normal
        exponent += 1023;
        mantissa = mantissa * Math.pow(2, 52);
    }

    // Round the mantissa
    if (mantissa < 0) {
        mantissa = -mantissa;
    }
    if (mantissa >= 1) {
        if (rounding === "up") {
            mantissa = 1;
        } else if (rounding === "down") {
            mantissa = 0;
        } else if (rounding === "zero") {
            mantissa = 0;
        } else {
            let diff1 = mantissa - Math.floor(mantissa);
            let diff2 = Math.ceil(mantissa) - mantissa;
            if (diff1 < diff2) {
                mantissa = Math.floor(mantissa * 2) / 2;
            } else if (diff1 > diff2) {
                mantissa = Math.ceil(mantissa * 2) / 2;
            } else {
                if (Math.floor(mantissa * 2) % 2 === 0) {
                    mantissa = Math.floor(mantissa * 2) / 2;
                } else {
                    mantissa = Math.ceil(mantissa * 2) / 2;
                }
            }
        }
    }

    // Convert sign, exponent, and mantissa to bin
    let binarySign = (sign === "+") ? "0" : "1";
    let binaryExponent = decToBin(exponent, 11);
    let binaryMantissa = mantissa.toString(2).padStart(64, "0").slice(12, 64);
    
    if (exponent === -1023 && mantissa === 0) {
        // Negative infinity
        binarySign = "1";
        binaryExponent = "0".repeat(11);
        binaryMantissa = "0".repeat(51) + "1";
    }

    // Combine sign, exponent, and mantissa to form bin
    let bin = binarySign + binaryExponent + binaryMantissa;

    // Add spaces between sections of bin for readability
    bin = bin.replace(/(.{1})(.{11})(.{52})/, "$1 $2 $3");

    return bin;
}

function decToBin(dec, num) {
    let bin = "";
    for (let i = num - 1; i >= 0; i--) {
        let exp = Math.pow(2, i);
        if (dec >= exp) {
            bin += "1";
            dec -= exp;
        } else {
            bin += "0";
        }
    }
    return bin;
}
    
        function binaryToHexadecimal(bin) {
            // Split bin into four-bit chunks
            let chunks = bin.split(/\s+/).join("").match(/.{1,4}/g);
    
            // Convert each chunk to hexadecimal
            let hexadecimal = "";
            for (let i = 0; i < chunks.len; i++) {
                let chunk = chunks[i];
                let dec = binToDec(chunk);
                let hex = decToHex(dec);
                hexadecimal += hex;
            }
    
            return hexadecimal;
        }
    
        function decToBin(dec, len) {
            let bin = dec.toString(2);
            while (bin.len < len) {
                bin = "0" + bin;
            }
            return bin;
        }
    
        function binToDec(bin) {
            return parseInt(bin, 2);
        }
    
        function decToHex(dec) {
            return dec.toString(16).toUpperCase();
        }
    
		function saveToFile(data, filename) {
			// Create blob with bin data
			let blob = new Blob([data], {type: "application/octet-stream"});

			// Create URL for blob
			let url = URL.createObjectURL(blob);

			// Create link element for download
			let link = document.createElement("a");
			link.href = url;
			link.download = filename || "IEEE-754.txt";

			// Click link to start download
			link.click();

			// Clean up
			URL.revokeObjectURL(url);
		}
