


function rgbToHex(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}



const container = document.createElement('div');
container.classList.add('grid-container');
r = new Array(61);
g = new Array(61);
b = new Array(61);
q = [];
for (let i = 0; i < 61; i++) {
    r[i] = i * 4;
    g[i] = i * 2;
    b[i] = i * 1;
    q.push(i+32);
}


const note = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const octave = ['-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const buttonCounts = [6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6];;

let id = 61; // Initialize ID counter

buttonCounts.forEach(count => {
    const row = document.createElement('div');
    row.classList.add('grid-row');

    const frame = document.createElement('div');
    frame.classList.add('grid-frame');

    id = id - count; 
    for (let i = 0; i < count; i++) {
        const button = document.createElement('button');
        button.classList.add('grid-button');
        button.id = id++; // Assign ID and increment counter
        button.textContent = button.id + ":"; // Set ID as button label
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = rgbToHex(r[button.id], g[button.id], b[button.id]);
        colorPicker.addEventListener('input', () => {
                button.style.backgroundColor = colorPicker.value;
                r[button.id] = parseInt(colorPicker.value.slice(1, 3), 16);
                g[button.id] = parseInt(colorPicker.value.slice(3, 5), 16);
                b[button.id] = parseInt(colorPicker.value.slice(5, 7), 16);

        });
        const dropdown = document.createElement('select');
        for (let i = 0; i <= 127; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${note[i % 12]}${octave[Math.floor(i / 12)]}`;
            if( i === q[button.id]){
                option.selected = true;
            }
            dropdown.appendChild(option);
        }
        button.appendChild(dropdown);
        button.appendChild(colorPicker);
        button.style.width = count === 5 ? '20%' : '16.666666666666666%';

        button.style.backgroundColor = `rgb(${r[button.id]}, ${g[button.id]}, ${b[button.id]})`;
        button.style.color = 'white';
        button.addEventListener('click', () => {
            //colorPicker.click();
        });
        frame.appendChild(button);
        frame.appendChild(document.createElement('a'));
    }
    id = id - count; // Decrement counter to account for the extra increment

    row.appendChild(frame);
    container.appendChild(row);
    container.appendChild(document.createElement('br'));
});


textField = document.createElement('input');
textField.type = 'text';
textField.id = 'textField';
textField.style.width = '100%';


const saveDiv = document.createElement('div');
const generateButton = document.createElement('button');
generateButton.textContent = 'Generate';
generateButton.style.width = '100%';
generateButton.addEventListener('click', () => {
    let text = new Uint8Array(62 * 18);
    text[0] = 0x00;
    text[1] = 0x00;
    text[2] = 0x00;
    text[3] = 0xF0;
    text[4] = 0x00;
    text[5] = 0x21;
    text[6] = 0x7E;
    text[7] = 0x3F;
    text[8] = 0xF0;
    text[9] = 0x00;
    text[10] = 0x21;
    text[11] = 0x7E;
    text[12] = 0x3F;
    text[13] = 0xF0;
    text[14] = 0x00;
    text[15] = 0x21;
    text[16] = 0x7E;
    text[17] = 0x3F;

    for (let i = 1; i < 62; i++) {
        let rr = r[i - 1]/2;
        let gg = g[i - 1]/2; 
        let bb = b[i - 1]/2;
        let key =  i - 1;
        text[i * 18] = 0xF0;
        text[i * 18 + 1] = 0x00;
        text[i * 18 + 2] = 0x21;
        text[i * 18 + 3] = 0x7E;
        text[i * 18 + 4] = 0x03;
        text[i * 18 + 5] = key ;
        text[i * 18 + 6] = rr;
        text[i * 18 + 7] = gg;
        text[i * 18 + 8] = bb;
        text[i * 18 + 9] = 0xF7;
        text[i * 18 + 10] = 0xF0; 
        let noteValue = document.getElementById(i- 1).querySelector('select').value;
        text[i * 18 + 11] = 0x00;
        text[i * 18 + 12] = 0x21;
        text[i * 18 + 13] = 0x7E;
        text[i * 18 + 14] = 0x04;
        text[i * 18 + 15] = key;
        text[i * 18 + 16] = noteValue;
        text[i * 18 + 17] = 0xF7;
    }
    data = new Blob([text], {type: 'application/octet-stream'});
    saveAs(data, 'data.syx');
    
   
});

saveDiv.appendChild(generateButton);
container.appendChild(saveDiv);
document.body.appendChild(container);
