function A() {}
function B() {}
function C() {}

const functionMap = {
  A: A,
};

functionMap["A"]?.();

const functions = ["A", "B"];
const exist = functions.includes("B");
