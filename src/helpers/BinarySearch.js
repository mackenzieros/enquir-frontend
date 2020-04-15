const search = (val, arr, accessor) => {
    var start = 0;
    var end = arr.length - 1;
    while (start <= end) {
        var mid = start + Math.floor((end - start) / 2);
        if (arr[mid][accessor] === val) {
            return mid;
        } else if (arr[mid][accessor] < val) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return -1;
};

export {
    search,
};