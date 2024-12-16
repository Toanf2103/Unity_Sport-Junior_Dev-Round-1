// Compress file data.json để đạt được file size là nhỏ nhất có thể

const fs = require('fs').promises;

// Hàm đọc file
async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return data;
    } catch (err) {
        throw new Error(`Lỗi khi đọc file: ${err.message}`);
    }
}

// Hàm lưu file
async function saveFile(filePath, content) {
    try {
        await fs.writeFile(filePath, content, 'utf8');
        return 'Lưu file thành công!';
    } catch (err) {
        throw new Error(`Lỗi khi lưu file: ${err.message}`);
    }
}

function removeKeyValues(data, removeValues = [null, undefined, '']) {
    const shouldRemove = (value) => removeValues.includes(value);

    if (Array.isArray(data)) {
        return data
            .map(item => removeKeyValues(item, removeValues))
            .filter(item => !shouldRemove(item) && !(Array.isArray(item) && item.length === 0));
    }

    if (typeof data === 'object' && data !== null) {
        const result = {};
        
        for (let key in data) {
            const value = removeKeyValues(data[key], removeValues); // Đệ quy cho giá trị của key
            
            if (!shouldRemove(value) && !(Array.isArray(value) && value.length === 0) && !(typeof value === 'object' && Object.keys(value).length === 0)) {
                result[key] = value;
            }
        }
        
        return Object.keys(result).length > 0 ? result : null;
    }

    return shouldRemove(data) ? null : data;
}


function deepParseJSON(input) {
    if (Array.isArray(input)) {
        return input.map(item => deepParseJSON(item)); 
    }

    // Kiểm tra nếu input là object
    if (typeof input === 'object' && input !== null) {
        const parsedObject = {};
        for (const key in input) {
            parsedObject[key] = deepParseJSON(input[key]);
        }
        return parsedObject;
    }

    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input);
            return deepParseJSON(parsed);
        } catch (e) {
            return input;
        }
    }

    return input;
}

function compressJSON(json) {
    const keyMap = {};
    const reverseMap = {};
  
    let counter = 0;
    function getShortKey(longKey) {
      if (!keyMap[longKey]) {
        const shortKey = String.fromCharCode(97 + counter);
        keyMap[longKey] = shortKey;
        reverseMap[shortKey] = longKey;
        counter++;
      }
      return keyMap[longKey];
    }
  
    function compressObject(obj) {
      if (Array.isArray(obj)) {
        return obj.map(compressObject);
      } else if (typeof obj === 'object' && obj !== null) {
        const compressed = {};
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            compressed[getShortKey(key)] = compressObject(obj[key]);
          }
        }
        return compressed;
      }
      return obj;
    }
  
    const compressedData = compressObject(json);
    return { compressedData, reverseMap };
  }

  function decompressJSON(compressedJson) {
    const { compressedData, reverseMap } = compressedJson;
  
    // Hàm đệ quy để giải mã JSON
    function decompressObject(obj) {
      if (Array.isArray(obj)) {
        return obj.map(decompressObject);
      } else if (typeof obj === 'object' && obj !== null) {
        const decompressed = {};
        for (let shortKey in obj) {
          if (obj.hasOwnProperty(shortKey)) {
            const longKey = reverseMap[shortKey];
            decompressed[longKey] = decompressObject(obj[shortKey]);
          }
        }
        return decompressed;
      }
      return obj;
    }
  
    return decompressObject(compressedData);
  }

// Sử dụng các hàm trên
(async () => {
    try {
        // Đọc file
        const filePath = './data.json';
        let data = await readFile(filePath);
        data = deepParseJSON(data);
        data = removeKeyValues(data, [undefined, null, '']);
        data = compressJSON(data)
        // Lưu file
        const newFilePath = './output2.json';
        await saveFile(newFilePath, JSON.stringify(data));

        let newData = await readFile(newFilePath);
        console.log(decompressJSON(JSON.parse(newData)));
    } catch (error) {
        console.error(error.message);
    }
})();
