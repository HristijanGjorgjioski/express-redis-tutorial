const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.status(200).json({ users, status: "ok" });
    } catch (error) {
        console.log("[Server]: Error occured", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getUsers
}
