import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Form,
  Button,
  ProgressBar,
  ListGroup,
} from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import CountUp from "react-countup";
import "chart.js/auto";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    income: 5000,
    expenses: 3200,
    balance: 1800,
  });

  const [incomeList, setIncomeList] = useState([
    { date: "2025-08-01", description: "Salary", amount: 3000 },
    { date: "2025-08-10", description: "Freelance", amount: 2000 },
  ]);

  const [expenseList, setExpenseList] = useState([
    { date: "2025-08-02", description: "Rent", amount: 1000 },
    { date: "2025-08-05", description: "Food", amount: 500 },
    { date: "2025-08-12", description: "Transport", amount: 300 },
    { date: "2025-08-15", description: "Entertainment", amount: 1400 },
  ]);

  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [incomeDesc, setIncomeDesc] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const budgetLimit = 5000;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { label: "Income", data: [], backgroundColor: "green" },
      { label: "Expenses", data: [], backgroundColor: "red" },
    ],
  });

  const [pieData, setPieData] = useState({
    labels: ["Income", "Expenses"],
    datasets: [{ data: [0, 0], backgroundColor: ["#28a745", "#dc3545"] }],
  });

  const filteredIncome = selectedMonth
    ? incomeList.filter(
        (i) => new Date(i.date).getMonth() + 1 === parseInt(selectedMonth)
      )
    : incomeList;

  const filteredExpense = selectedMonth
    ? expenseList.filter(
        (e) => new Date(e.date).getMonth() + 1 === parseInt(selectedMonth)
      )
    : expenseList;

  const allDates = Array.from(
    new Set([...filteredIncome, ...filteredExpense].map((i) => i.date))
  ).sort();

  // تحديث بيانات الرسوميات ديناميكيًا
  useEffect(() => {
    setChartData({
      labels: allDates,
      datasets: [
        {
          label: "Income",
          data: allDates.map((date) =>
            filteredIncome
              .filter((inc) => inc.date === date)
              .reduce((a, b) => a + b.amount, 0)
          ),
          backgroundColor: "green",
        },
        {
          label: "Expenses",
          data: allDates.map((date) =>
            filteredExpense
              .filter((exp) => exp.date === date)
              .reduce((a, b) => a + b.amount, 0)
          ),
          backgroundColor: "red",
        },
      ],
    });

    setPieData({
      labels: ["Income", "Expenses"],
      datasets: [
        {
          data: [
            filteredIncome.reduce((sum, i) => sum + i.amount, 0),
            filteredExpense.reduce((sum, e) => sum + e.amount, 0),
          ],
          backgroundColor: ["#28a745", "#dc3545"],
        },
      ],
    });
  }, [incomeList, expenseList, selectedMonth]);

  const handleAddIncome = () => {
    if (!incomeDesc || !incomeAmount) return;
    const newIncome = {
      date: new Date().toISOString().split("T")[0],
      description: incomeDesc,
      amount: parseInt(incomeAmount),
    };
    setIncomeList([...incomeList, newIncome]);
    const newTotalIncome = summary.income + newIncome.amount;
    setSummary({
      ...summary,
      income: newTotalIncome,
      balance: newTotalIncome - summary.expenses,
    });
    setIncomeDesc("");
    setIncomeAmount("");
    setShowIncome(false);
  };

  const handleAddExpense = () => {
    if (!expenseDesc || !expenseAmount) return;
    const newExpense = {
      date: new Date().toISOString().split("T")[0],
      description: expenseDesc,
      amount: parseInt(expenseAmount),
    };
    setExpenseList([...expenseList, newExpense]);
    const newTotalExpenses = summary.expenses + newExpense.amount;
    setSummary({
      ...summary,
      expenses: newTotalExpenses,
      balance: summary.income - newTotalExpenses,
    });
    setExpenseDesc("");
    setExpenseAmount("");
    setShowExpense(false);
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsIncome = XLSX.utils.json_to_sheet(filteredIncome);
    const wsExpense = XLSX.utils.json_to_sheet(filteredExpense);
    XLSX.utils.book_append_sheet(wb, wsIncome, "Income");
    XLSX.utils.book_append_sheet(wb, wsExpense, "Expenses");
    XLSX.writeFile(wb, "Financial_Report.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Income", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [["Date", "Description", "Amount"]],
      body: filteredIncome.map((i) => [i.date, i.description, i.amount]),
    });
    doc.text("Expenses", 14, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Date", "Description", "Amount"]],
      body: filteredExpense.map((e) => [e.date, e.description, e.amount]),
    });
    doc.save("Financial_Report.pdf");
  };
  const usagePercent = ((summary.expenses / budgetLimit) * 100).toFixed(1);

  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = filteredExpense.reduce((sum, e) => sum + e.amount, 0);
  const finalBalance = totalIncome - totalExpense;
  const topExpenses = [...filteredExpense]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      {/* Summary Cards */}
      <div className="d-flex justify-content-between my-4">
        <Card className="text-center p-3" style={{ width: "30%" }}>
          <h5>Total Income</h5>
          <h3>
            $<CountUp end={summary.income} duration={1} separator="," />
          </h3>
        </Card>
        <Card className="text-center p-3" style={{ width: "30%" }}>
          <h5>Total Expenses</h5>
          <h3>
            $<CountUp end={summary.expenses} duration={1} separator="," />
          </h3>
        </Card>
        <Card className="text-center p-3" style={{ width: "30%" }}>
          <h5>Balance</h5>
          <h3>
            $<CountUp end={summary.balance} duration={1} separator="," />
          </h3>
        </Card>
      </div>

      {/* Alerts */}
      {summary.expenses > budgetLimit && (
        <div className="alert alert-danger">
          ⚠️ You have exceeded your budget limit!
        </div>
      )}
      {summary.balance > 2000 && (
        <div className="alert alert-success">
          🎉 Great! You are saving money efficiently.
        </div>
      )}

      {/* Budget Progress */}
      <div className="mb-3">
        <h6>Budget Usage</h6>
        <ProgressBar
          now={usagePercent}
          label={`${usagePercent}%`}
          variant={usagePercent > 100 ? "danger" : "info"}
        />
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between mb-3">
        <div>
          <Button
            variant="success"
            className="me-2"
            onClick={() => setShowIncome(true)}
          >
            Add Income
          </Button>
          <Button variant="danger" onClick={() => setShowExpense(true)}>
            Add Expense
          </Button>
        </div>
        <div>
          <Form.Select
            className="mb-2"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </Form.Select>
          <Button variant="info" className="me-2" onClick={exportExcel}>
            Export Excel
          </Button>
          <Button variant="secondary" onClick={exportPDF}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showIncome && (
        <Modal
          title="Add Income"
          desc={incomeDesc}
          setDesc={setIncomeDesc}
          amount={incomeAmount}
          setAmount={setIncomeAmount}
          onClose={() => setShowIncome(false)}
          onSave={handleAddIncome}
        />
      )}
      {showExpense && (
        <Modal
          title="Add Expense"
          desc={expenseDesc}
          setDesc={setExpenseDesc}
          amount={expenseAmount}
          setAmount={setExpenseAmount}
          onClose={() => setShowExpense(false)}
          onSave={handleAddExpense}
        />
      )}

      {/* Income Table */}
      <h4>Income</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncome.map((inc, idx) => (
            <tr key={idx}>
              <td>{inc.date}</td>
              <td>{inc.description}</td>
              <td>${inc.amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">
              <strong>Total Income</strong>
            </td>
            <td>
              <strong>${totalIncome}</strong>
            </td>
          </tr>
        </tfoot>
      </Table>

      {/* Expense Table */}
      <h4>Expenses</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpense.map((exp, idx) => (
            <tr key={idx}>
              <td>{exp.date}</td>
              <td>{exp.description}</td>
              <td>${exp.amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">
              <strong>Total Expenses</strong>
            </td>
            <td>
              <strong>${totalExpense}</strong>
            </td>
          </tr>
        </tfoot>
      </Table>

      {/* Balance Summary */}
      <div className="balance-summary mt-3 p-3 text-center">
        <h5>
          Balance Remaining: $
          <CountUp end={finalBalance} duration={1} separator="," />
        </h5>
      </div>

      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Monthly Overview</h4>
          <div style={{ maxWidth: "700px", height: "300px", margin: "0 auto" }}>
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="col-md-6">
          <h4>Income vs Expenses</h4>
          <div style={{ maxWidth: "400px", height: "300px", margin: "0 auto" }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Top 3 Expenses */}
      <div className="mt-4">
        <h5>Top 3 Expenses</h5>
        <ListGroup>
          {topExpenses.map((exp, idx) => (
            <ListGroup.Item key={idx}>
              {exp.description}: ${exp.amount}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}

// Modal Component
function Modal({ title, desc, setDesc, amount, setAmount, onClose, onSave }) {
  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={onSave}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
