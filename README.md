User Story
As below is part of the user story:

1. As McDonald's normal customer, after I submitted my order, I wish to see my order flow into "PENDING" area. After the cooking bot process my order, I want to see it flow into to "COMPLETE" area.
2. As McDonald's VIP member, after I submitted my order, I want my order being process first before all order by normal customer. However if there's existing order from VIP member, my order should queue behind his/her order.
3. As McDonald's manager, I want to increase or decrease number of cooking bot available in my restaurant. When I increase a bot, it should immediately process any pending order. When I decrease a bot, the processing order should remain un-process.
4. As McDonald bot, it can only pickup and process 1 order at a time, each order required 10 seconds to

Requirements

1. When "New Normal Order" clicked, a new order should show up "PENDING" Area.
2. When "New VIP Order" clicked, a new order should show up in "PENDING" Area. It should place in-front of all existing "Normal" order but behind of all existing "VIP" order.
3. The order number should be unique and increasing.
4. When "+ Bot" clicked, a bot should be created and start processing the order inside "PENDING" area. after 10 seconds picking up the order, the order should move to "COMPLETE" area. Then the bot should start processing another order if there is any left in "PENDING" area.
5. If there is no more order in the "PENDING" area, the bot should become IDLE until a new order come in.
6. When "- Bot" clicked, the newest bot should be destroyed. If the bot is processing an order, it should also stop the process. The order now back to "PENDING" and ready to process by other bot.
7. No data persistance is needed for this prototype, you may perform all the process inside memory.

Edge cases

1. Minimum number of cooking bots is 0. Will disable the "- Bot" button.
2. Put processing order back to the front of queue based on customer type. If bot was processing a normal order, it will be placed at the front of normal queue. If bot was processing a VIP order, it will be placed at the front of VIP queue.

Logic:

1. Use 1 queue for all the orders. For normal orders, append it to the end of the queue. For VIP orders, insert it to the front of the queue.
2. Each time a cooking bot is available, pop the first order in the queue and process it.
3. If a cooking bot is destroyed while cooking, the current processing order will be inserted to the front of the queue.
4. Each order has the following information on it:
   - food items
   - status (pending, processing, complete)
   - customer type
   - id
5. Each cooking bot has the following information on it:
   - status (idle, busy)
   - time left??
   - id
6. Either loop through the whole bot list to check if there's any idle bot and assign new order, or maintain a separate array for free bots to quickly assign new order
