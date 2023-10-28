import fees from './fees.json' assert { type: 'json'};
import orders from './orders.json' assert { type: 'json'};
import { Fee, Order } from './types';

// Function to calculate the price for each order
function calculateOrderPrice(order: Order, feeData: Fee[]) {
  let totalOrderPrice = 0;

  if (!order.order_items?.length) return
  console.log(`Order ID: ${order.order_number}`);
  for (let index = 0; index < order.order_items.length; index++) {
    const item = order.order_items[index];
    const feeInfo = feeData.find((fee) => fee.order_item_type === item.type);

    if (feeInfo) {
      // Extract flat and per-page fees and page count for the item
      const flatFee = parseFloat(
        feeInfo?.fees?.find((fee) => fee.type === "flat")?.amount || "0"
      );
      const perPageFee = parseFloat(
        feeInfo?.fees?.find((fee) => fee.type === "per-page")?.amount || "0"
      );
      const pageCount = item.pages;

      // Calculate the price for the item based on fees and page count
      const itemPrice = flatFee + perPageFee * Math.max(0, pageCount - 1);
      totalOrderPrice += itemPrice;

      console.log(`   Order item ${index + 1}: $${itemPrice.toFixed(2)}`);
    }
  }

  // Output the total price for the order
  console.log(`   Order total: $${totalOrderPrice.toFixed(2)}`);
  console.log("");
}

// Create an object to store the fund totals
const fundTotals: any = {};

// Function to calculate fund distributions for each order
function calculateFundDistributions(order: Order, feeData: Fee[]) {
  console.log(`Order ID: ${order.order_number}`);
  if (!order.order_items?.length) return 
  for (const item of order.order_items) {
    const feeInfo = feeData.find(fee => fee.order_item_type === item.type);
    if (feeInfo && feeInfo?.distributions && feeInfo.fees) {
      for (const distribution of feeInfo?.distributions) {
        const fundName = distribution.name;
        const fundAmount = parseFloat(distribution.amount);
        const itemPrice = parseFloat(feeInfo?.fees?.find(fee => fee.type === 'flat')?.amount || "0") +
          parseFloat(feeInfo?.fees?.find(fee => fee?.type === 'per-page')?.amount || '0') || 0 * Math.max(0, item.pages - 1);
        const itemDistribution = (itemPrice / order.order_items.length) * fundAmount / 100;

        // Initialize the fund total if it doesn't exist
        if (!fundTotals[fundName]) {
          fundTotals[fundName] = 0;
        }

        // Update the fund total
        fundTotals[fundName] += itemDistribution;

        // Output the fund distribution for the current item
        console.log(`  Fund - ${fundName}: $${itemDistribution.toFixed(2)}`);
      }
    }
  }
  console.log('');
}

console.log('------------------------- Challenge 1 ------------------------')
console.log('--- Prices for each order in orders calculed based on fees ---')
console.log('--------------------------------------------------------------')
console
// Part 1 of the challenge calculation
// Loop through each order and calculate its price
for (const order of orders) {
  calculateOrderPrice(order, fees);
}

console.log('-------------------------------------- Challenge 2 -------------------------------')
console.log('--- Print out each Fund distribution and the total after processing all orders ---')
console.log('----------------------------------------------------------------------------------')
// Part 2 of the challenge calculation
for (const order of orders) {
  calculateFundDistributions(order, fees);
}

// Output the total distributions
console.log('Total distributions:');
for (const fundName in fundTotals) {
  console.log(`  Fund - ${fundName}: $${fundTotals[fundName].toFixed(2)}`);
}
