// 1. Thuật toán kiểm tra chuỗi đối xứng.

function isPalindrome(str) {
    let left = 0;
    let right = str.length - 1;

    str = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    while (left < right) {
        if (str[left] !== str[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

console.log(isPalindrome('a'))