export function RandomHandle (length) {
    charList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 
                'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', 
                '8', '9'];
    rand = "";
    for (i=0; i<length; i++) {
        pos = Math.floor(Math.random() * charList.length);
        rand += charList[pos];
    }
    return rand;
}

export function Hash (string) {
    let hash = 0;

    for (i=0; i<string.length; i++) {
        c = string.charCodeAt(i);
        hash = ((hash << 5) - hash ) + c;
    }
    return hash;
}