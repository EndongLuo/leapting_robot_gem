module.exports = function arrayToTree(data) {
  const tree = [];
  const sitenameMap = new Map();

  data.forEach((item) => {
    const { sitename, block, row, section, PVMID, num } = item;
    let sitenameNode = sitenameMap.get(sitename);

    if (!sitenameNode) {
      sitenameNode = {
        id: tree.length + 1,
        label: sitename,
        children: [],
      };
      tree.push(sitenameNode);
      sitenameMap.set(sitename, sitenameNode);
    }

    let currentNode = sitenameNode;

    [block, row, section, num].forEach((label, idx) => {
      let nextNode = currentNode.children.find((node) => node.label === label);

      if (!nextNode) {
        nextNode = {
          id: currentNode.children.length + 11,
          label: label,
          children: [],
        };
        currentNode.children.push(nextNode);

        if (idx === 0) {  // 这是 block 层, 需要对 children 进行排序
          currentNode.children.sort((a, b) => {
            const numA = parseInt(a.label.replace('4S-', ''), 10);
            const numB = parseInt(b.label.replace('4S-', ''), 10);
            return numA - numB;
          });
        }
      }

      currentNode = nextNode;
    });

    const numItem = { id: PVMID, label: PVMID, num };

    currentNode.children.push(numItem);
    currentNode.children.sort((a, b) => a.num - b.num);
  });

  return tree;
}