let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let textAreaCont = document.querySelector(".textarea-cont");
let mainCont = document.querySelector(".main-cont");
let visible = false;
let priorityColorElems = document.querySelectorAll(".priority-color");
let defaultTicketColor = "black";
let colors = ["light-pink", "light-blue", "light-green", "black"];
let removeBtn = document.querySelector(".remove-btn");
let removeStateActive = false;
let toolbarColors = document.querySelectorAll(".toolbar-color");

let ticketsArray = [];

if( localStorage.getItem("jira_tickets") ){
    let items = JSON.parse(localStorage.getItem("jira_tickets"));
    items.forEach( (obj) => {
        createTicket(obj.ticket_id, obj.ticket_color, obj.ticket_text);
    })
}


addBtn.addEventListener("click", (e) => {
    visible = !visible;
    if( visible ){
        modalCont.style.display = "flex";
    }else{
        modalCont.style.display = "none";
    }
})

removeBtn.addEventListener("click", (e) => {
    removeStateActive = !removeStateActive;
})

modalCont.addEventListener("keydown", (e) => {
    if( e.ctrlKey && e.key === "Enter" ){ 
        let ticket_id = shortid();
        let ticket_color = defaultTicketColor;
        let ticket_text = textAreaCont.value;
        createTicket( ticket_id, ticket_color, ticket_text );
        visible = false;
        // setting default color
        defaultTicketColor = "black";
        //setting default border position
        priorityColorElems.forEach( (e) => {
            e.classList.remove("border");
        })
        priorityColorElems[3].classList.add("border");

        modalCont.style.display = "none";
        textAreaCont.value = "";
    }
})

priorityColorElems.forEach( (ele) => {
    ele.addEventListener("click", (e) => {
        priorityColorElems.forEach( (e) => {
            e.classList.remove("border");
        })
        ele.classList.add("border");
        defaultTicketColor = ele.classList[0];
    })
})

function createTicket(ticket_id, ticket_color, ticket_text){
    let ticket = document.createElement("div");
    ticket.setAttribute("class", "ticket-cont");

    ticket.innerHTML = `
        <div class="ticket-color ${ticket_color}"></div>
        <div class="ticket-id">#${ticket_id}</div>
        <div class="ticket">${ticket_text}</div>
        <div class="lock-cont">
            <i class="fas fa-lock lock-icon"></i>
        </div>
    `;
    mainCont.appendChild(ticket);
    let ticket_obj = {ticket_id, ticket_color, ticket_text};
    ticketsArray.push(ticket_obj);

    //adding to local storage
    localStorage.setItem("jira_tickets", JSON.stringify(ticketsArray));

    handleRemove(ticket, ticket_id);
    handleLock(ticket, ticket_id);
    handlePriorityColor(ticket, ticket_id);
}

function handleLock(ticket, id) {
    let lockCont = ticket.querySelector(".lock-cont");
    let lockIcon = lockCont.children[0];
    let ticketTaskArea = ticket.querySelector(".ticket");
    lockIcon.addEventListener("click", (e) => {
        if(lockIcon.classList.contains("fa-lock")){
            lockIcon.classList.remove("fa-lock");
            lockIcon.classList.add("fa-lock-open");
            ticketTaskArea.setAttribute("contenteditable", "true");
        }else{
            lockIcon.classList.remove("fa-lock-open");
            lockIcon.classList.add("fa-lock");
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

        // making changes in ticketsArray
        let index = getIndex(id);
        let obj = ticketsArray[index];
        obj.ticket_text = ticketTaskArea.innerHTML;
        // adding to the local storage
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArray));
    })
}

function handlePriorityColor(ticket, id) {
    let ticketColorElem = ticket.querySelector(".ticket-color");
    ticketColorElem.addEventListener("click", (e) => {
        let currentColor = ticketColorElem.classList[1];
        let idx = 0;
        for(let i = 0; i < 4; i++) {
            if( colors[i] === currentColor ){
                idx = i;
                break;
            }
        };
        ticketColorElem.classList.remove(currentColor);
        let newColor = colors[ (idx + 1) % 4 ];
        ticketColorElem.classList.add(newColor);

        // making changes in ticketsArray
        let index = getIndex(id);
        let obj = ticketsArray[index];
        obj.ticket_color = newColor;
        // adding to the local storage
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArray));

    })
}

console.log(ticketsArray);

function handleRemove(ticket, id){
    ticket.addEventListener("click", (e) => {
        if(removeStateActive){
            ticket.remove();
            let idx = getIndex(id);
            ticketsArray.splice(idx, 1);
            localStorage.setItem("jira_tickets", JSON.stringify(ticketsArray));
        }
    })
}

function getIndex(id){
    let idx = 0;
    for( let i = 0; i < ticketsArray.length; i++ ){
        let ticketObj = ticketsArray[i];
        if( id == ticketObj.ticket_id ){
            idx = i;
            break;
        }
    }
    return idx;
}

// adding filtering functionality
toolbarColors.forEach( (toolbarColor) => {
    toolbarColor.addEventListener("click" ,(e) => {
        let selectedColor = toolbarColor.classList[0];
        let ticketContainers = document.querySelectorAll(".ticket-cont");
        ticketContainers.forEach( (ticketCont) => {
            let currentColor = ticketCont.querySelector(".ticket-color").classList[1];
            if( selectedColor !== currentColor ){
                ticketCont.style.display = "none";
            }else{
                ticketCont.style.display = "block";
            }
        })
    })
})

toolbarColors.forEach( (toolbarColor) => {
    toolbarColor.addEventListener("dblclick" ,(e) => {
        let ticketContainers = document.querySelectorAll(".ticket-cont");
        ticketContainers.forEach( (ticketCont) => {
            ticketCont.style.display = "block";
        })
    })
})