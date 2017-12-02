
const noteTitleSpecification = {
    create(title) {
        return {
            isSatisfiedBy(note) {
                return note.title === title;
            },
        };
    },
};

export default noteTitleSpecification;
