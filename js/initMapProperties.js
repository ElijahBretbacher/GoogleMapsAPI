//openModalButtons is a list of all the buttons that can open the popup (modal)
let openModalButtons = document.querySelectorAll('[data-modal-target]')
//closeModalButtons is a list of all the buttons that can close the popup
let closeModalButtons = document.querySelectorAll('[data-close-button]')
//The overlay
let overlay = document.getElementById('overlay')

//A list of all the markers currently on the screen
let markers = []

//Give every openModalButton the ability to call the popup
openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

/* Closes the Popup when a click outside the box is registered

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})
 */

//Give every button the ability to close the popup
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

//unused at the moment
function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

//opens the popup and the overlay
function openCreateModal() {
    document.getElementById("modal").classList.add('active')
    overlay.classList.add('active')
}

function openEditModal() {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}
//closes the popup and the overlay
function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

/**
 *
 * @param props an associative array that holds different values to give the marker
 * @param map the map the marker is displayed on
 */
function addMarker(props, map){
    //creates a marker
    let marker = new google.maps.Marker({
        adds:null,
        position:props.coords,
        icon: props.icon,
        map:map,
    })

    //if the properties give content, create an infoWindow and wait for the marker to be clicked
    if (props.content){
        let infoWindow = new google.maps.InfoWindow({
            //the content to be displayed in the window
            content:props.content
        })
        marker.addListener("click", function () {
            infoWindow.open(map, marker);
            map.setZoom(15);        //map.getZoom() returns an integer
            map.setCenter(marker.getPosition());
        })
    }
    //add the marker to the array
    markers.push(marker)
}

/**
 *
 * @param adds additional information stored as an associative array.
 * @param map the map the marker is on
 */
function editMarker(adds, map){
    let marker = markers[markers.length-1]
    let content = ""

    marker.adds = adds

    //create a content string that is later displayed in the infoWindow
    content+="<h1>" + adds.name + "</h1>" +
        "<ul class='infoWindow-list'>" +
            "<li>" + adds.address + "</li>" +
            "<li>" + adds.plz + " " + adds.place + "</li>" +
            "<li>" + adds.person + "</li>" +
            "<li>" + adds.telnr + "</li>" +
            "<li>" + adds.status + "</li>" +
        "</ul>" +
        "<button data-modal-target='#create-modal' onclick='openEditModal()'>Edit Marker</button>"
    marker.content = content

    console.log(adds.connection)

    //sets the markers custom icon
    //should work but cant refresh page without deleting temporary markers.
    switch (adds.connection){
        case "black":
            marker.icon = {url:"img/factory_black.png"}
            break;
        case "red":
            marker.icon = {url:"img/factory_red.png"}
            break
        case "yellow":
            marker.icon = {url:"img/factory_yellow.png"}
            break
        case "green":
            marker.icon = {url:"img/factory_green.png"}
            break
    }

    //Creates an infoWindow for the marker
    if (marker.content){
        let infoWindow = new google.maps.InfoWindow({
            content:content
        })
        marker.addListener("click", function () {
            infoWindow.open(map, marker);
            //setZoom() and setCenter() doesnt work
            //map.setZoom(15);        //map.getZoom() returns an integer
            //map.setCenter(marker.getPosition());
        })
    }
    if (marker.icon){
       //window.location.reload()
    }

}

function initMap(){
    //------start init-------
    //Map options
    let options = {
        zoom:8,
        center:{lat:47.985873126114875, lng:13.813881409890756}
    }

    //New Map
    let map = new google.maps.Map(document.getElementById("map"), options)

    //Listen for click on map
    google.maps.event.addListener(map, "click", function (event) {
        //AddMarker
        addMarker({
            coords:event.latLng
        }, map);
        openCreateModal()
    })


    //-------start adding default values--------

    //figure out how to trigger the editMarker() function after pressing the button
    let gmundenBhf = "<h1>Gmunden</h1>" +
        "<button data-modal-target='#create-modal' onclick='openEditModal()'>Edit Marker</button>";

    addMarker(
        {
            coords:{lat:47.92597709353937, lng:13.784003654315905},
            icon:{
                url:"img/factory_black.png",
                //scaledSize:new google.maps.Size(28, 31)
            },
            content:gmundenBhf
        },
        map
    );
    let linzBhf = "<h1>Linz</h1>"
    addMarker(
        {
            coords:{lat:48.290667486886036, lng:14.291188684742679},
            icon:{
                url: "img/factory_green.png"
            },
            content:linzBhf
        },
        map
    );
}