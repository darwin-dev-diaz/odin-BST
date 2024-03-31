const createNode = (data) => {
  return {
    data: data,
    left: null,
    right: null,
  };
};

const createTree = (arr) => {
  arr = arr
    .sort((a, b) => a - b)
    .filter((item, index) => arr.indexOf(item) === index);

  const buildTree = (array, start, end) => {
    if (start > end) {
      return null;
    }

    const mid = Math.floor((start + end) / 2);
    const root = createNode(array[mid]);

    root.left = buildTree(array, start, mid - 1);
    root.right = buildTree(array, mid + 1, end);

    return root;
  };

  const root = buildTree(arr, 0, arr.length - 1);

  const insert = (value, node = root) => {
    // base case: if the current nodes value is the same as value, just return
    if (node.data === value) return;

    // base case: if the value is greater or smaller than the current node, and the accompanying spot is clear, place the value there as a new node
    if (node.data > value && !node.left) {
      node.left = createNode(value);
      return;
    }
    if (node.data < value && !node.right) {
      node.right = createNode(value);
      return;
    }

    // recursive case: if none of the above conditions have been met, see if the value is greater or smaller than node.data. Select the appropriate node and call this function again.
    if (node.data > value) insert(value, node.left);
    else if (node.data < value) insert(value, node.right);
  };

  const prettyPrint = (node = root, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  return { root, prettyPrint, insert };
};

// const tree = createTree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
const tree = createTree([1, 2, 3, 4, 5, 6]);
tree.prettyPrint();
tree.insert(3);
tree.insert(2);
tree.insert(11);
tree.prettyPrint();

// const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// console.log(
//   arr.sort((a, b) => a - b).filter((item, index) => arr.indexOf(item) === index)
// );
