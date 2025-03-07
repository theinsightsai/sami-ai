export const DUMMY_DATA = {
  insights: [
    {
      summary:
        "The time-series data shows a consistent sales trend over the first five days of January 2024, with a peak in sales on January 3rd due to high sales of Headphones.",
      visualization: {
        chart_type: "line",
        data: [
          {
            x: "2024-01-01",
            y: 10,
          },
          {
            x: "2024-01-02",
            y: 15,
          },
          {
            x: "2024-01-03",
            y: 25,
          },
          {
            x: "2024-01-04",
            y: 8,
          },
          {
            x: "2024-01-05",
            y: 20,
          },
        ],
        title: "Sales Trend Over Time",
        x_label: "Date",
        y_label: "Sales",
      },
    },
    {
      summary:
        "The financial data indicates that the highest revenue was generated on January 1st with Laptop sales, while the highest profit was recorded on January 3rd with Headphones.",
      visualization: {
        chart_type: "bar",
        data: [
          {
            x: "2024-01-01",
            y: 12000,
          },
          {
            x: "2024-01-02",
            y: 9000,
          },
          {
            x: "2024-01-03",
            y: 5000,
          },
          {
            x: "2024-01-04",
            y: 6000,
          },
          {
            x: "2024-01-05",
            y: 3000,
          },
        ],
        title: "Revenue and Profit by Date",
        x_label: "Date",
        y_label: "Amount",
      },
    },
    {
      summary:
        "Customer satisfaction is generally high across all products, with Headphones receiving the highest satisfaction score of 4.8.",
      visualization: {
        chart_type: "bar",
        data: [
          {
            x: "Laptop",
            y: 4.5,
          },
          {
            x: "Smartphone",
            y: 4.2,
          },
          {
            x: "Headphones",
            y: 4.8,
          },
          {
            x: "Tablet",
            y: 4.3,
          },
          {
            x: "Keyboard",
            y: 4.7,
          },
        ],
        title: "Customer Satisfaction by Product",
        x_label: "Product",
        y_label: "Customer Satisfaction",
      },
    },
    {
      summary:
        "The sales data shows that Electronics category products have higher sales volumes compared to Accessories, with Smartphones and Laptops leading in sales.",
      visualization: {
        chart_type: "bar",
        data: [
          {
            x: "Laptop",
            y: 10,
          },
          {
            x: "Smartphone",
            y: 15,
          },
          {
            x: "Headphones",
            y: 25,
          },
          {
            x: "Tablet",
            y: 8,
          },
          {
            x: "Keyboard",
            y: 20,
          },
        ],
        title: "Sales by Product Category",
        x_label: "Product",
        y_label: "Sales",
      },
    },
  ],
};
