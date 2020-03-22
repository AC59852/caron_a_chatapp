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
        typing: false   
        
    },

    watch: {
        message(value) {
          value ? socket.emit('typing', this.nickname) : socket.emit('stoptyping');
        }
      },
    
      created() {
        socket.on('typing', (data) => {
          console.log(data);
          this.typing = data || 'Anonymous';
        });
        socket.on('stoptyping', () => {
          this.typing = false;
        });
      },


    methods:{
        //emit a message event to the server so that is 
        // can in turn sent this to enyone who's connectoed
        dispatchMessage(){
            console.log('handle emit message');
        // the double pipe || is an "or" operator
        //if the first value is set, use it. else use
        // whatver comes after the "or " operator
        if (this.message != "") {
            socket.emit('chat_message', {
                content: this.message,
                name: this.nickname || 'anonymous'
            });
            this.message = "";
        } 
        },
        isTyping() {
            socket.emit('typing', this.nickname);
          },
    },
    mounted(){
        console.log('vue is done mounting');
        // Using a mix of plain JavaScript and jQuery, this allows the user to add emojis into the text box
        // without removing anything that they type inside, before or after choosing an emoji

        // the reason this isn't running in methods, is that you can't apply a foreach loop without all objects
        // adding to the textarea, since it runs each time any object is clicked with that class.
        $('.newText').each(function(index) {
            $(this).on("click", function() {

                var items = $(this).text();
                var textarea = document.querySelector(".mainText");

                textarea.value += items;
            });
        });


    },

    components:{
        newmessage:ChatMessage
    }
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('disconnect', showDisconnectMessage);
socket.addEventListener('new_message', appendMessage);