export const treeNodeReducer = (state: any = [], action) => {
  console.log(`In treeNodeReducer - ${JSON.stringify(action)} / ${JSON.stringify(state)}`);
  switch (action.name) {
    case 'LOAD_NODES':
      console.log(`In LOAD_NODES for ${JSON.stringify(action)}`);
      return state;
//      state.selectedNode = state.nodes[action.key];
    case 'SELECT_NODE':
//      state.selectedNode = state.nodes[action.key];
        console.log(`In SELECT_NODE for ${JSON.stringify(action)}`);
        return state;
    }

};