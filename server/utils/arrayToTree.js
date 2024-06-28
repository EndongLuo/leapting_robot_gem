module.exports = function arrayToTree(data) {
  const tree = [];
  const sitenameMap = new Map();

  data.forEach((item) => {
    const { sitename, block, row, section, PVMID, num } = item;
    let sitenameNode = sitenameMap.get(sitename);

    if (!sitenameNode) {
      sitenameNode = {
        id: sitename,
        label: sitename,
        children: [],
      };
      tree.push(sitenameNode);
      sitenameMap.set(sitename, sitenameNode);
    }

    let currentNode = sitenameNode;
    // const levels = [block, row, section, num];
    const levels = [
      { label: block, id: block },
      { label: row, id: `${block}_${row}` },
      { label: section, id: `${block}_${row}_${section}` },
      { label: num, id: `${block}_${row}_${section}_${num}` },
    ];

    levels.forEach(({label, id}, idx) => {
      let nextNode = currentNode.children.find((node) => node.label === label);

      if (!nextNode) {
        nextNode = { id, label, children: [] };
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