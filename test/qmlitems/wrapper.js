function Wrapper(textEdit) {
    this.textEdit = textEdit;
}

Wrapper.prototype.getText = function() {
    return this.textEdit.text;
};

Wrapper.prototype.setText = function(text) {
    this.textEdit.text = text;
};

module.exports = Wrapper;
