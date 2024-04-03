const form=document.querySelector("form");
const submit=document.querySelector(".Submit");
const updates=document.querySelector(".Updates");
const body=document.querySelector("table>tbody");
//data store in indexed db
submit.addEventListener("click",()=>{
let idb=indexedDB.open('crud',1)
idb.onupgradeneeded=()=>{
    let res=idb.result;
    res.createObjectStore('data',{autoIncrement:true})
}
idb.onsuccess=()=>{
    let res=idb.result;
    let tx=res.transaction('data','readwrite');
    let store=tx.objectStore('data');
    store.put({
        name:form[0].value,
        email:form[1].value,
        phone:form[2].value,
        address:form[3].value
    })
    alert("data has been added")
    location .reload();
}
})

function read(){
    let idb=indexedDB.open('crud',1);
    idb.onsuccess=()=>{
        let res=idb.result;
        let tx=res.transaction('data','readonly');
        let store=tx.objectStore('data');
        let cursor=store.openCursor();
        cursor.onsuccess=()=>{
            let curRes=cursor.result;
            if(curRes){
                console.log(curRes.value.name);
                body.innerHTML +=` 
                <tr>
                <td>${curRes.value.name}</td>
                <td>${curRes.value.email}</td>
                <td>${curRes.value.phone}</td>
                <td>${curRes.value.address}</td>
                <td onclick="update(${curRes.key})" >Update</td>
                <td onclick="del(${curRes.key})" >Delete</td>
                </tr>`;
                curRes.continue();
            }
        }
    }
}
function del(e){
    let idb=indexedDB.open('crud',1)
    idb.onsuccess=()=>{
        let res=idb.result;
        let tx=res.transaction('data','readwrite')
        let store=tx.objectStore('data')
        store.delete(e)
        alert('data has been deleted');
        location.reload();
    }

}
let updateKey;
function update(e){
    submit.style.display="none";
    updates.style.display="block"
updateKey=e;
}

updates.addEventListener('click', () => {
    // Open the IndexedDB database
    let idb = indexedDB.open('crud', 1);

    idb.onsuccess = () => {
        let res = idb.result;
        let tx = res.transaction('data', 'readwrite'); // Fixed 'rs' to 'res'
        let store = tx.objectStore('data');

        // Assuming updateKey is defined somewhere in your code
        // It should be the key of the record you want to update

        // Retrieve form values
        let form = document.querySelectorAll('input[type="text"]');
        
        // Check if updateKey exists
        if (updateKey) {
            // Update the record
            store.put({
                name: form[0].value,
                email: form[1].value,
                phone: form[2].value,
                address: form[3].value
            }, updateKey);
            
            // Alert user that data has been updated
            alert("Data has been updated");
            
            // Reload the page
            location.reload();
        } else {
            // If updateKey is not defined, handle the error accordingly
            alert("Error: Update key is not defined");
        }
    };
});



read();