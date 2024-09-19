const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const List = document.querySelector('#item-list');
const itemClear = document.querySelector('#clear');
const clearButton = document.querySelector('#clear');
const filterButton = document.querySelector('#filter')

function reloadItemsFromStorage(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));

    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value;

    //validation
    if (newItem === '') {
        alert('please add an item');
        return;
    }

    //creating and adding items to the DOM
    addItemToDOM(newItem);

    //adding to the local storage in the browser
    addItemToStorage(newItem);

    //clearing the input
    itemInput.value = '';

    checkUI();
}

function addItemToDOM(item){
    // creating a list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

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

}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();
    

    itemsFromStorage.push(item);
    //now convert to string and set to local storage
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}


function getItemsFromStorage (){
    
    let itemsFromStorage;//this will be the array
    
    //if localStorage is empty then make itemFromStorage empty
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
        //else, get the array(in the from of a string) from localStorage then parse it into an array
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    
    return itemsFromStorage;
}

function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);    
    }
}

function removeItem(item) {
    //remove item from DOM
    item.remove();
    
    //remove item from localStorage
    removeItemFromStorage(item.textContent);
    
    checkUI();
}

//this will remove items from local Storage
function removeItemFromStorage(item){
    //getting items that are already in storage
    let itemsFromStorage = getItemsFromStorage();

    //removing the desired item from array 
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));

    // localStorage.clear();

    // itemsFromStorage.forEach((item)=>{
    //     addItemToStorage(item);
    // });
}

//clear all function
function clearItems(e) {
    //asks for confirmation before deleting
    if (confirm('Are you sure? this will delete all items in the list.')) {
        while (List.firstChild) {
            List.firstChild.remove();
        }
    }

    localStorage.removeItem('items');

    checkUI();
}


//filter
function filterItems(e) {
    //list of all items in a nodeCollection
    const items = document.querySelectorAll('li');
    //text from filter input
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLocaleLowerCase();
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
    });
}

//hiding and showing clearAll and filter buttons
function checkUI() {
    const items = document.querySelectorAll('li');

    //if item list is empty
    if (items.length === 0) {
        clearButton.style.display = 'none';
        filterButton.style.display = 'none'
    } else { // if item list is not empty

        clearButton.style.display = 'block';
        filterButton.style.display = 'block'
    }
}

//Initializing function
function init(){
    //event listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    List.addEventListener('click', onClickItem);
    itemClear.addEventListener('click', clearItems);
    filterButton.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', reloadItemsFromStorage);
    
    checkUI();
    
}

init();