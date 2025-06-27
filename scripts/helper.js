export function checkElementExistThenExecTrue(element, func) {
    if (element) {
        func();
    } else {
        console.error("element not found this func was not excuted: ", func);
    }

}