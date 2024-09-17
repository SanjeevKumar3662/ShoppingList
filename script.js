const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const List = document.querySelector('#item-list');
const itemClear = document.querySelector('#clear');

function addItem(e) {
    e.preventDefault();
    const newItem = itemInput.value;

    //validation
    if (newItem === '') {
        alert('please add an item');
        return;
    }

    // creating a list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(newItem));

    //creating button
    const button = document.createElement('button');
    button.className = "remove-item btn-link text-red";
    const iTag = document.createElement('i');
    iTag.className = "fa-solid fa-xmark";
    button.appendChild(iTag);

    //appending button to li
    li.appendChild(button);

    //li to body
    List.appendChild(li);

    //clearing the input
    itemInput.value = '';
}


function removeItem (e){
    //checking if the target's parent have the class name remove item
    if(e.target.parentElement.classList.contains('remove-item'))
    {
        e.target.parentElement.parentElement.remove();
    }
    console.log();

}

//clear all function
function clearItems(e){
    while(List.firstChild)
    {
        List.firstChild.remove();
    }
}

//event listeners
itemForm.addEventListener('submit', addItem);
List.addEventListener('click', removeItem);
itemClear.addEventListener('click', clearItems);

