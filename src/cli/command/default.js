// do nothing by default, just conform to the interface
const getCommandInfo = () => null;

const run = () => {
    console.log('Unknown command');
    return null;
};

export { getCommandInfo, run };
