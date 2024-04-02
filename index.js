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

    const mid = Math.ceil((start + end) / 2);
    const root = createNode(array[mid]);

    root.left = buildTree(array, start, mid - 1);
    root.right = buildTree(array, mid + 1, end);

    return root;
  };

  let root = buildTree(arr, 0, arr.length - 1);

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

  const deleteItem = (value, node = root) => {
    // base case: if node is a leaf node and doesn't contain the value return null
    if (node.data !== value && !node.left && !node.right) return false;
    // case one: if the node has a single child, replace the current node with this child
    else if (
      node.data === value &&
      ((!node.left && node.right) || (node.left && !node.right))
    ) {
      const newNode = node.left ? node.left : node.right;
      node.data = newNode.data;
      if (node.left) node.left = newNode.left;
      else node.right = newNode.right;
      return true;
    }
    // case two: if the node is a leaf node just set it to null (this one searches ahead)
    else if (
      node.right &&
      node.right.data === value &&
      !node.right.left &&
      !node.right.right
    ) {
      node.right = null;
      return true;
    } else if (
      node.left &&
      node.left.data === value &&
      !node.left.left &&
      !node.left.right
    ) {
      node.left = null;
      return true;
    }

    // case three: if the node has two children, remove the next biggest value and update the key to the value
    else if (node.data === value && node.left && node.right) {
      let nextHighestNodeParent = node;
      let iterations = 0;
      while (true) {
        if (
          nextHighestNodeParent.right &&
          !nextHighestNodeParent.right.left &&
          !iterations
        )
          break;
        else if (iterations > 1 && !nextHighestNodeParent.left.left) break;
        else if (iterations >= 1) {
          if (iterations === 1)
            nextHighestNodeParent = nextHighestNodeParent.right;
          else nextHighestNodeParent = nextHighestNodeParent.left;
        }

        iterations++;
      }
      if (!iterations) {
        node.data = nextHighestNodeParent.right.data;
        node.right = nextHighestNodeParent.right.right;
      } else if (nextHighestNodeParent.left.right) {
        node.data = nextHighestNodeParent.left.data;
        nextHighestNodeParent.left = nextHighestNodeParent.left.right;
      } else {
        node.data = nextHighestNodeParent.left.data;
        nextHighestNodeParent.left = null;
      }
      return true;
    }

    if (node.left) deleteItem(value, node.left);
    if (node.right) deleteItem(value, node.right);
  };

  const find = (value, node = root) => {
    // base case is if the current node is equal to null
    if (!node) return null;

    if (node.data === value) return node;

    const returnNode = find(value, node.left);
    return returnNode ? returnNode : find(value, node.right);
  };

  const levelOrder = (callback = null, queue = [root], returnArr = []) => {
    // goes through the tree breath first.
    // If provided a call back function, calls the function with the current node as parameter
    // returns list of breath first values
    const node = queue.shift();
    returnArr.push(node.data);

    if (callback) callback(node);

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);

    if (queue.length) {
      levelOrder(callback, queue, returnArr);
    }
    return returnArr;
  };

  const preOrder = (callback = null, node = root, returnArr = []) => {
    if (node) {
      if (callback) callback(node);
      returnArr.push(node.data);
      preOrder(callback, node.left, returnArr);
      preOrder(callback, node.right, returnArr);
      return returnArr;
    }
  };

  const inOrder = (callback = null, node = root, returnArr = []) => {
    if (node) {
      inOrder(callback, node.left, returnArr);
      if (callback) callback(node);
      returnArr.push(node.data);
      inOrder(callback, node.right, returnArr);
      return returnArr;
    }
  };

  const postOrder = (callback = null, node = root, returnArr = []) => {
    if (node) {
      postOrder(callback, node.right, returnArr);
      postOrder(callback, node.left, returnArr);
      if (callback) callback(node);
      returnArr.push(node.data);
      return returnArr;
    }
  };

  const height = (node = root, highest = 0) => {
    // base case: when the node is leaf, return
    if (!node.left && !node.right) return highest;

    // get the height of the right and left side.
    const heightRight = node.right ? height(node.right, highest + 1) : 0;
    const heightLeft = node.left ? height(node.left, highest + 1) : 0;

    // return the height of the highest side
    return heightLeft > heightRight ? heightLeft : heightRight;
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

  return {
    prettyPrint,
    insert,
    deleteItem,
    find,
    levelOrder,
    preOrder,
    inOrder,
    postOrder,
    height,
  };
};

const tree = createTree([5]);
tree.insert(1.5);
tree.insert(6);
tree.insert(7);
tree.insert(8);
tree.insert(9);
tree.insert(10);
tree.insert(11);
tree.insert(12);
tree.insert(8.5);
tree.insert(0.5);
// tree.insert(1.5);
// tree.insert(2.5);
// tree.insert(3.5);
// tree.insert(3.25);
// tree.insert(3.75);
// tree.insert(4);
// const tree = createTree([1,2,3,4,5]);
// const tree = createTree([
//   "a",
//   "b",
//   "c",
//   "d",
//   "e",
//   "f",
//   "g",
//   "h",
//   "i",
//   "j",
//   "k",
// ]);
// const tree = createTree([1, 2, 3, 4, 5, 6]);

// tree.prettyPrint();

tree.prettyPrint();
// console.log(tree.postOrder((node)=>console.log(node.data * 2)));
console.log(tree.height());

// tree.levelOrder(function test(node) {
//   console.log("The current nodes value doubled is: " + node.data * 2);
// });
