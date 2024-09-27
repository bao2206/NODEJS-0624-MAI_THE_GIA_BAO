const MainService = require("../services/subscriber_service");
const nameRoute = "subscribe";
class MailController {
    getAll = async(req, res, next) => {
        try {
            let status = req.query.status || "all";
            let searchTerm = req.query.keyword || "";
            let filter = {};
            if (status !== "all") filter.status = status;
      
            let items = searchTerm
              ? await MainService.findItem(searchTerm, filter)
              : await MainService.getAllItems(filter);
      
            let page = parseInt(req.query.page) || 1;
            const itemsPerPage = 10;
            const totalItems = items.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            const paginatedItems = items.slice(startIndex, endIndex);
      
            let countStatus = [
              {
                name: "All",
                countStatus: await MainService.countStatus(""),
                link: "",
                class: status === "all" ? "btn-success" : "btn-default",
              },
              {
                name: "Active",
                countStatus: await MainService.countStatus("active"),
                link: "active",
                class: status === "active" ? "btn-success" : "btn-default",
              },
              {
                name: "Inactive",
                countStatus: await MainService.countStatus("inactive"),
                link: "inactive",
                class: status === "inactive" ? "btn-success" : "btn-default",
              },
            ];
            let successMessage = req.query.successMessage || "";
            let errorMessage = req.query.errorMessage || "";
            res.render(`admin/pages/${nameRoute}/list`, {
              items: paginatedItems,
              countStatus,
              currentPage: page,
              totalPages,
              searchTerm,
              status,
              successMessage,
              errorMessage,
            });
          } catch (err) {
            console.log(err);
          }
    }
    saveEmailAndSendIt = async (req,res,next) =>{
        
        try{
            const {"widget-subscribe-form-email":email} = req.body;
            await MainService.saveEmailAndSendNotification(email);
            console.log("Email sent successfully");
            return res.json({
                alert: 'success',
                message: 'Email has been seen successfully!'
            })
        } catch (error){
            console.error('Error sending email', error);
            return res.json({
                alert: 'error',
                message: 'Failed to send email. Please try again.'
            })
        }
    }
    updateStatus = async(req, res, next) =>{
        try {
            const { id } = req.params;
            const item = await MainService.getEleById(id);
      
            if (item) {
              const newStatus = item.status === "active" ? "inactive" : "active";
              await MainService.updateItemById(id, { status: newStatus });
              // req.flash("successMessage", `Item status updated to ${newStatus}`);
              res.json({ success: true, status: newStatus });
            } else {
              // req.flash("errorMessage", "Item not found");
              res.status(404).json({ success: false, message: "Item not found" });
            }
          } catch (err) {
            console.log(err);
            // req.flash("errorMessage", "Error updating status");
            res.status(500).json({ success: false, message: "An error occurred" });
          }
    }
    deleteItem = async (req, res, next) => {
        try {
          const { id } = req.params;
          const item = await MainService.getEleById(id);
    
          await MainService.deleteItemById(id);
          res.redirect(
            `/admin/${nameRoute}?successMessage=Item deleted successfully`
          );
        } catch (error) {
          console.log(error);
          res.redirect(`/admin/${nameRoute}?errorMessage=Error deleting item`);
        }
      };
}

module.exports = new MailController();