const Account = require("../../models/account.model");

const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    res.render("admin/pages/auth/login", {
        pageTitle: "Trang đăng nhập",
    });
};

// [GET] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email này không tồn tại");
        res.redirect("back");
        return;
    }

    if (md5(password) != user.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }

    if (user.status != "active") {
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("back");
        return;
    }

    res.cookie("token", user.token);

    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};
