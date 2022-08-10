export { helpers, toggleModal };

function toggleModal(modalID){
  // document.getElementById(modalID).classList.toggle("hidden");
  // document.getElementById(modalID + "-backdrop").classList.toggle("hidden");
  // document.getElementById(modalID).classList.toggle("flex");
  // document.getElementById(modalID + "-backdrop").classList.toggle("flex");
}

const helpers = {
  format_time: (date) => {
    return date.toLocaleTimeString();
  },
  format_date: (date) => {
    return `${new Date(date).getMonth()+1}/${new Date(date).getDate()}/${new Date(date).getFullYear()+5}`
  }
};