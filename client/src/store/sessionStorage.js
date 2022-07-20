export const loadState = () => {
    try {
      const serializedState = sessionStorage.getItem('Storage');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
}; 

export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem('Storage', serializedState);
    } catch {
      // ignore write errors
      console.log('write error!')
    }
};