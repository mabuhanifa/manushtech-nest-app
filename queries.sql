-- This SQL file contains queries for monthly-sales
SELECT
    TO_CHAR ("order"."createdAt", 'YYYY-MM') AS month,
    SUM("order"."totalAmount") AS total_sales
FROM
    "order"
WHERE
    "order"."createdAt" >= NOW () - INTERVAL '6 months'
GROUP BY
    TO_CHAR ("order"."createdAt", 'YYYY-MM')
ORDER BY
    month ASC;

-- this query will return user-orders
SELECT
    "user"."id" AS userId,
    "user"."name" AS userName,
    COUNT("order"."id") AS totalOrders,
    SUM("order"."totalAmount") AS totalSpending
FROM
    "user"
    LEFT JOIN "order" ON "user"."id" = "order"."userId"
GROUP BY
    "user"."id",
    "user"."name"
ORDER BY
    "user"."id";

-- this query will return product-sales
SELECT
    product.id AS "productId",
    product.name AS "productName",
    SUM(order_item.quantity) AS "totalQuantity",
    SUM(order_item.price * order_item.quantity) AS "totalRevenue"
FROM
    order_item
    INNER JOIN product ON order_item."productId" = product.id
GROUP BY
    product.id,
    product.name
ORDER BY
    "totalQuantity" DESC;