const { Menu, Category, Order, OrderItem } = require('../models');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const midtransClient = require('midtrans-client');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


class Controller {
    static async listBooks(req, res, next) {
        try {
            const orders = await Order.findAll({
                where: {
                    UserId: req.user.id
                },
                include: OrderItem
            });
            
            
            const books = await Book.findAll({
                include: Genre
            });


            const prompt = `
                Based on the following orders data: ${JSON.stringify(orders)}, 
                give me 2/3 recommended orders from lastest order and the recommended order must get from ${JSON.stringify(books)}. 
                Do not include items outside this list menu.

                Respond strictly in the JSON format:
                [
                    {
                        "name": "string",
                        "description": "string",
                        "price": 0,
                        "imgUrl": "string",
                        "stock": 0,
                        "GenreId": 0
                    }
                ]

                If no recommendations, return [].`;
            console.log(prompt, "prompt <<<<<<<<<<<<<<<");
            
            const response = await model.generateContent(prompt);

            console.log(response, "response <<<<<<<<<<<<<<<");
            const cleanResponse = response.response.text().replace(/```json|```/g, "").trim(); 
            const result = JSON.parse(cleanResponse);

            // const rawResult = await model.generateContent(prompt);
            // const result = JSON.parse(rawResult.response.text());
            console.log(result, "result <<<<<<<<<<<<<<<");



            res.status(200).json({books, result});
            
        } catch (error) {
            console.log(error, "<<<<<<<<<<<<<<<<<<<<<");
            
            next(error);
        }
    }

    static async createBook(req, res, next) {
        try {
            const {
                name,
                description,
                price,
                imgUrl,
                stock,
                GenreId
            } = req.body;

            const data = await Book.create({
                name,
                description,
                price,
                imgUrl,
                stock,
                GenreId
            });

            res.status(201).json(data);
            
        } catch (error) {
            next(error)
        }
    }

    static async updateBook(req, res, next) {
        try {
            const { id } = req.params;

            const book = await Book.findByPk(id);
            if (!book) {
                throw { name: "NotFound", message: "Book not found!" };
            }

            const {
                name,
                description,
                price,
                imgUrl,
                stock,
                GenreId
            } = req.body

            const newBook = await Book.update({
                name,
                description,
                price,
                imgUrl,
                stock,
                GenreId  
            }, {
                where: { id },
                returning: true
            })

            res.status(200).json(newBook[1][0]);
            
        } catch (error) {
            next(error)
        }
    }

    static async detailBook(req, res, next) {
        try {
            const { id } = req.params;

            const book = await Book.findOne({
                where: { id },
                include: Genre
            });

            if (!book) {
                throw { name: "NotFound", message: "Book not found!" };
            }

            res.status(200).json(menu);
            
        } catch (error) {
            next(error);
        }
    }

    static async deleteBook(req, res, next) {
        try {
            const { id } = req.params;

            const book = await Book.findByPk(id);
            if (!book) {
                throw { name: "NotFound", message: "Book not found!" };
            }

            let message = `${book.name} success deleted`

            await book.destroy();

            res.status(200).json({ message });
            
            
        } catch (error) {
            next(error);
        }
    }

    static async listGenres(req, res, next) {
        try {
            const genres = await Genre.findAll();

            res.status(200).json(genres);
            
        } catch (error) {
            next(error)
        }
    }

    static async makeOrder(req, res, next) {
        try {
            const {
                totalAmount,
                orderItems
            } = req.body

            const newOrder = await Order.create({
                codeOrder: "ORD-" + new Date().getTime(),
                totalAmount,
                UserId: req.user.id
            })

            orderItems.forEach(async (orderItem) => {
                await OrderItem.create({
                    quantity: orderItem.quantity,
                    unitPrice: orderItem.unitPrice,
                    OrderId: newOrder.id,
                    BookId: orderItem.BookId
                });
            });

            let snap = new midtransClient.Snap({
                // Set to true if you want Production Environment (accept real transaction).
                isProduction : false,
                serverKey : process.env.MIDTRANS_SERVER_KEY
            });

            let parameter = {
                "transaction_details": {
                    "order_id": "TRX-ORDER-"+newOrder.id,
                    "gross_amount": totalAmount
                },
                "credit_card":{
                    "secure" : true
                },
                "customer_details": {
                    "first_name": req.user.fullName,
                    "email": req.user.email,
                    "phone": req.user.phoneNumber
                }
            };

            const midtransToken = await snap.createTransaction(parameter);
            await Order.update({
                midtransToken: midtransToken.token
            }, {
                where: { id : newOrder.id }
            })

            res.status(201).json({ message: "Create order success!", midtransToken});


        } catch (error) {
            next(error)
        }
    }

    static async listOrders(req, res, next) {
        try {
            const orders = await Order.findAll({
                where: {
                    UserId : req.user.id
                }
            });

            res.status(200).json(orders);
            
        } catch (error) {
            next(error)
        }
    }
}


module.exports = Controller;