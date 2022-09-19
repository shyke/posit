const app = new Vue({
  el: "#app",
  data: {
    entity: 0,
    customers: [],
    name: "",
    phone: "",
    ticket: {
      title: "",
      description: "",
      customer: ""
    },
    newTicketBoardVisible: false,
    newTicketErrorVisible: false
  },
  computed: {
    hideLogin: function() {
      return this.entity !== 0;
    },
    date: function() {
      return new Date().toLocaleDateString("he-IL", {
        timeZone: "Asia/Jerusalem"
      });
    },
    hideAddTicket: function() {
      return this.entity > -1 || this.newTicketBoardVisible;
    }
  },
  watch: {},
  methods: {
    handleLoginSelect: async function(e) {
      let val = Number(e.target?.value);
      // Sanity Check
      if (isNaN(Number(val))) return;
      // Fetch data
      if (this.entity !== val) {
        if (val < 0) {
          // Admin
          this.name = "ADMIN";
          this.phone = "";
        } else if (val > 0) {
          // Technician
          try {
            let res = await fetch(`/api/technicians/${val}`);
            let technician = await res.json();
            this.name = technician.name;
            this.phone = technician.phone;
          } catch (e) {
            console.error(e);
          }
        }
      }
      // Update the view
    },
    handleLogout: function(e) {
      this.resetData();
    },
    resetData: function() {
      this.entity = 0;
      this.name = "";
      this.phone = "";
      this.ticket = {};
    },
    handleAddTicket: function(e) {
      this.newTicketBoardVisible = true;
    },
    handleSaveNewTicket: async function() {},
    handleCancelNewTicket: function() {
      this.ticket = {};
      this.newTicketBoardVisible = false;
    },
    validateNewTicketBeforePost: function() {}
  }
});
