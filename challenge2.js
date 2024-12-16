// 2. Bài toán Two Sum
// Cho một mảng số nguyên nums và một số nguyên target, hãy tìm tất cả các cặp chỉ số của hai số trong mảng mà tổng của chúng bằng target. Giả định rằng có thể có nhiều cặp thỏa mãn điều kiện này, và bạn cần trả về tất cả các cặp chỉ số khác nhau.

function twoSum(nums, target) {
    // Hash map để lưu trữ giá trị và index
    const map = new Map();
    const result = [];

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // Kiểm tra xem complement có trong map không
        if (map.has(complement)) {
            // Lấy tất cả index của complement
            const complementIndexes = map.get(complement);
            
            // Thêm tất cả các cặp index thỏa mãn điều kiện
            complementIndexes.forEach(complementIndex => {
                // Đảm bảo index khác nhau và thứ tự index
                if (complementIndex < i) {
                    result.push([complementIndex, i]);
                }
            });
        }

        // Thêm index của số hiện tại vào map
        if (!map.has(nums[i])) {
            map.set(nums[i], []);
        }
        map.get(nums[i]).push(i);
    }

    return result;
}

console.log(twoSum([1,3,4,5,5,6,7,8,9], 11))