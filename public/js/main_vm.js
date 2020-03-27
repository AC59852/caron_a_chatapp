// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";
const socket = io();
// the packet is shatever data we send through with the connect event
// form the server
// this is data destructioring. Go look it up on MND
function setUserId({sID}){
    //debugger
    console.log(sID);
    vm.socketID = sID;
}

function showDisconnectMessage(){
    console.log('a user disconnected');
}

function appendMessage(message){
    vm.messages.push(message);
}

const vm = new Vue({
    data:{

        socketID: "",
        message: "",
        nickname: "anonymous",
        messages:[],
        typing: false,
        
    },

    watch: {
        message(value) {
          value ? socket.emit('typing', this.nickname) : socket.emit('stoptyping');
        }
      },
    
      created() {

        // display a message when someone connects

        // check to see if someone is typing
        socket.on('typing', (data) => {
          console.log(data);
          this.typing = data || 'Anonymous';
          document.querySelector(".typing").classList.add('typingfade');
        });

        // check to see if someone stopped typing
        socket.on('stoptyping', () => {
          this.typing = false;
        });

        // if someone connected, display the alert
        socket.on('broadcast',function(data) {
            let userAlert = document.querySelector('.userAlert');

            userAlert.textContent = data.description;
            userAlert.classList.add('revealAnim');


            // after the animation ends, remove the text from the alert as to not conflict with the page
            userAlert.addEventListener('animationend', function() {
                userAlert.classList.remove('revealAnim');
                userAlert.textContent = "";
            });
         });

         // if someone disconnects, display the alert
         socket.on('broadcast2',function(data) {
            let userAlert2 = document.querySelector('.userAlert2');

            userAlert2.textContent = data.description2;
            userAlert2.classList.add('revealAnim');

            //after the animation ends, remove the text from the alert as to not conflict with the page
            userAlert2.addEventListener('animationend', function() {
                userAlert2.classList.remove('revealAnim');
                userAlert2.textContent = "";
            });
         });
      },
      


    methods:{

        hide() {
            let nicknameCon = document.querySelector('.nickCon');

            nicknameCon.classList.toggle('hide');
        },
        //emit a message event to the server so that is 
        // can in turn sent this to enyone who's connectoed

        dispatchMessage(){
            console.log('handle emit message');
        // the double pipe || is an "or" operator
        //if the first value is set, use it. else use
        // whatver comes after the "or " operator
        if (this.message != "") {
            socket.emit('chat_message', {
                userMessage: this.message,
                name: this.nickname || 'anonymous',
            });
            // remove anything in the chat box when submitting message
            this.message = "";
        } 
        },

        // display who is typing
        isTyping() {
            socket.emit('typing', this.nickname);
          },

          emoji(event) {

            // this is checking the data-value property of each p tag when clicked
            let emoji = event.target.dataset.value;

            // and setting the value of the message to be whatever is in the box + the clicked emoji
            this.message = this.message + emoji;
          }

    },
    mounted(){
        console.log('vue is done mounting');

    },

    components:{
        newmessage:ChatMessage
    }
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('disconnect', showDisconnectMessage);
socket.addEventListener('new_message', appendMessage);