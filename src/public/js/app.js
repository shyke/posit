const app = new Vue({
  el: "#app",
  data: {
    entity: 0,
    customers: [],
    technicians: [],
    warehouses: [],
    tickets: [],
    name: "",
    phone: "",
    ticket: {
      title: "",
      description: "",
      customer_id: "",
      hardware: "",
      technician_id: "",
      warehouse_id: "",
      date: ""
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
    },
    techniciansWithJobs: function() {
      let technicians = [...this.technicians];
      technicians.forEach(item => (item.jobs = 0));

      this.tickets.forEach(ticket => {
        let technitionIndex = technicians.findIndex(
          technician => technician.id === ticket.technician_id
        );
        if (technitionIndex > -1)
          technicians[technitionIndex].jobs
            ? technicians[technitionIndex].jobs++
            : (technicians[technitionIndex].jobs = 1);
      });
      return technicians.sort((a, b) => a.jobs - b.jobs);
    },
    employeeOfTheMonth: function() {
      return this.techniciansWithJobs
        .filter(
          item =>
            item.jobs &&
            item.jobs > 0 &&
            item.jobs === this.techniciansWithJobs.at(-1).jobs
        )
        .map(item => item.name)
        .join(",");
    }
  },
  filters: {},
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
          // Fetch Technitions
          let ticketsPromise = fetch(`/api/tickets`);
          let techniciansPromise = fetch(`/api/technicians`);
          let customersPromise = fetch(`/api/customers`);
          let warehousesPromise = fetch(`/api/warehouses`);
          let res = await Promise.all([
            ticketsPromise,
            techniciansPromise,
            customersPromise,
            warehousesPromise
          ]);
          for (let res_item of res) {
            try {
              let item = await res_item.json();
              // Add avialbility to warehouses
              if (item.table === "warehouses")
                item.data.forEach(item => (item.avialble = true));
              this[item.table] = item.data;
            } catch (e) {
              console.error(e);
            }
          }
        } else if (val > 0) {
          // Technician
          try {
            let technicianRes = await fetch(`/api/technicians/${val}`);
            let technician = await technicianRes.json();
            let ticketsPromise = await fetch(`/api/tickets?technician=${val}`);
            let techniciansPromise = fetch(`/api/technicians`);
            let customersPromise = fetch(`/api/customers`);
            let warehousesPromise = fetch(`/api/warehouses`);
            this.name = technician.name;
            this.phone = technician.phone;
            let res = await Promise.all([
              ticketsPromise,
              techniciansPromise,
              customersPromise,
              warehousesPromise
            ]);
            for (let res_item of res) {
              try {
                let item = await res_item.json();
                // Add avialbility to warehouses
                if (item.table === "warehouses")
                  item.data.forEach(item => (item.avialble = true));
                this[item.table] = item.data;
              } catch (e) {
                console.error(e);
              }
            }
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
      this.ticket = {
        title: "",
        description: "",
        customer_id: "",
        hardware: "",
        technician_id: "",
        warehouse_id: "",
        date: ""
      };
      this.newTicketBoardVisible = false;
      this.newTicketErrorVisible = false;
    },
    handleAddTicket: function(e) {
      this.newTicketBoardVisible = true;
      // Asign technician automaticly
      this.ticket.technician_id = this.techniciansWithJobs[0].id;
    },
    handleSaveNewTicket: async function() {
      // Validate Form
      this.validateNewTicketBeforePost();
      // Validation falied, abort POST process
      if (this.newTicketErrorVisible) return;
      let url = `api/tickets`;
      let data = { ...this.ticket };
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
      });
      try {
        // Refresh the tickets data
        try {
          // Refresh the tickets & warehouses
          let ticketsPromise = fetch(`/api/tickets`);
          let warehousesPromise = fetch(`/api/warehouses`);
          let res = await Promise.all([ticketsPromise, warehousesPromise]);
          for (let res_item of res) {
            try {
              let item = await res_item.json();
              // Add avialbility to warehouses
              if (item.table === "warehouses")
                item.data.forEach(item => (item.avialble = true));
              this[item.table] = item.data;
            } catch (e) {
              console.error(e);
            }
          }
        } catch (e) {
          console.error(e);
        }
        // Clean & Close the new ticket form
        this.handleCancelNewTicket();
      } catch (e) {
        console.error(e);
      }
    },
    handleCancelNewTicket: function() {
      this.ticket = {
        title: "",
        description: "",
        customer_id: "",
        hardware: "",
        technician_id: "",
        warehouse_id: "",
        date: ""
      };
      this.newTicketBoardVisible = false;
      this.newTicketErrorVisible = false;
    },
    handleHardwareChange: function(e) {
      let { value } = e.target;
      // Sanity Check
      if (!value) return;
      let key = `${value.split(" ").join("_")}_stock`;
      // Select avilable warehouse automaticly
      let availabile_warehouse = this.warehouses.find(
        warehouse => warehouse[key] && warehouse[key] > 0
      );
      // Mark warehouse with stock availability.
      this.warehouses.forEach(
        warehouse => (warehouse.avialble = warehouse[key] && warehouse[key] > 0)
      );

      if (!availabile_warehouse) {
        // Create out of stock message
      } else {
        this.ticket.warehouse_id = availabile_warehouse.id;
      }
    },
    validateNewTicketBeforePost: function() {
      this.newTicketErrorVisible = Object.keys(this.ticket).find(
        key => !this.ticket[key]
      );
    },
    findName: function(id, key) {
      // Sanity Check
      if (!id || !key) return "Unkwon";
      let data = this[key].find(item => item.id === id);
      return data?.name || "Unkwon";
    },
    handleDeleteTicket: async function(e) {
      let { id } = e.target;
      // Sanity Check
      if (!id) return;
      let url = `api/tickets/${id}`;
      const response = await fetch(url, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin" // include, *same-origin, omit
      });
      try {
        // Refresh the tickets & warehouses
        let ticketsPromise = fetch(`/api/tickets`);
        let warehousesPromise = fetch(`/api/warehouses`);
        let res = await Promise.all([ticketsPromise, warehousesPromise]);
        for (let res_item of res) {
          try {
            let item = await res_item.json();
            // Add avialbility to warehouses
            if (item.table === "warehouses")
              item.data.forEach(item => (item.avialble = true));
            this[item.table] = item.data;
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
});
