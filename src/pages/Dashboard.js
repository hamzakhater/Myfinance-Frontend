import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Form,
  Button,
  ProgressBar,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import CountUp from "react-countup";
import "chart.js/auto";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../services/api";
import "./Dashboard.css";
/* -------------------------
   Inline Notification Component
   ------------------------- */
function InlineNotification({ show, onClose, message, variant = "success" }) {
  if (!show) return null;
  return (
    <div className={`caht-notification caht-${variant}`}>
      <div className="caht-msg">{message}</div>
      <button className="caht-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

/* -------------------------
   Dashboard Component
   ------------------------- */
export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [incomeComment, setIncomeComment] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const budgetLimit = 5000;

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  // confirm (CAHT) state
  const [confirm, setConfirm] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Greeting message
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "صباح الخير";
    if (h >= 12 && h < 17) return "مساء الخير";
    return "مساء الخير";
  };

  // === Get username from token ===
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.name || "");
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  // load month from storage
  useEffect(() => {
    const savedMonth = localStorage.getItem("selectedMonth");
    if (savedMonth) setSelectedMonth(savedMonth);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedMonth", selectedMonth);
    updateCharts();
  }, [incomeList, expenseList, selectedMonth]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const incomes = (await axiosInstance.get("/income")).data.data || [];
      const expenses = (await axiosInstance.get("/expenses")).data.data || [];

      const totalIncome = incomes.reduce(
        (sum, item) => sum + (item.MonthlyIncome || 0),
        0
      );
      const totalExpenses = expenses.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );

      setIncomeList(incomes);
      setExpenseList(expenses);
      setSummary({
        income: totalIncome,
        expenses: totalExpenses,
        balance: totalIncome - totalExpenses,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setToast({
        show: true,
        message: "حدث خطأ أثناء جلب البيانات",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredIncome = selectedMonth
    ? incomeList.filter((i) => {
        const date = i.date ? new Date(i.date) : new Date();
        return date.getMonth() + 1 === parseInt(selectedMonth);
      })
    : incomeList;

  const filteredExpense = selectedMonth
    ? expenseList.filter(
        (e) => new Date(e.date).getMonth() + 1 === parseInt(selectedMonth)
      )
    : expenseList;

  const allDates = Array.from(
    new Set(
      [...filteredIncome, ...filteredExpense].map(
        (i) => i.date || new Date().toISOString()
      )
    )
  ).sort();

  function showConfirm(message, onConfirm) {
    setConfirm({ show: true, message, onConfirm });
  }

  function handleConfirmYes() {
    if (confirm.onConfirm) {
      // execute the provided function (can be async)
      try {
        const result = confirm.onConfirm();
        // if returns a promise, catch errors
        if (result && typeof result.then === "function") {
          result.catch((err) => {
            console.error(err);
            setToast({
              show: true,
              message: "حدث خطأ أثناء تنفيذ العملية",
              variant: "danger",
            });
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    setConfirm({ ...confirm, show: false });
  }

  function handleConfirmNo() {
    setConfirm({ ...confirm, show: false });
  }

  const updateCharts = () => {
    setChartData({
      labels: allDates,
      datasets: [
        {
          label: "Income",
          data: allDates.map((date) =>
            filteredIncome
              .filter((i) => (i.date || new Date().toISOString()) === date)
              .reduce((a, b) => a + (b.MonthlyIncome || 0), 0)
          ),
          backgroundColor: "rgba(40,167,69,0.6)",
        },
        {
          label: "Expenses",
          data: allDates.map((date) =>
            filteredExpense
              .filter((e) => (e.date || new Date().toISOString()) === date)
              .reduce((a, b) => a + (b.amount || 0), 0)
          ),
          backgroundColor: "rgba(220,53,69,0.6)",
        },
      ],
    });

    setPieData({
      labels: ["Income", "Expenses"],
      datasets: [
        {
          data: [
            filteredIncome.reduce((sum, i) => sum + (i.MonthlyIncome || 0), 0),
            filteredExpense.reduce((sum, e) => sum + (e.amount || 0), 0),
          ],
          backgroundColor: ["#28a745", "#dc3545"],
        },
      ],
    });
  };

  // ------------ Smart tip generator -------------
  const getSmartTip = () => {
    if (!expenseList || expenseList.length === 0)
      return "لا توجد بيانات لتقديم نصيحة.";
    // compute category totals
    const totals = expenseList.reduce((acc, e) => {
      const cat = e.category || "غير مصنف";
      acc[cat] = (acc[cat] || 0) + (e.amount || 0);
      return acc;
    }, {});
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const [topCat, topVal] = entries[0] || ["-", 0];
    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    const pct = total ? ((topVal / total) * 100).toFixed(1) : 0;
    let tip = `أكبر مصروف عندك هو "${topCat}" بنسبة ${pct}% من إجمالي المصروفات. حاول تقليلها 10%-20% لتوفير أفضل.`;
    if (pct > 40)
      tip = `تنبيه: "${topCat}" يشكّل ${pct}% من مصروفاتك — جدولة أو تقليص المصروف في هذه الفئة سيؤثر كثيراً على مدخراتك.`;
    return tip;
  };

  // ------------ Add Income (uses CAHT confirm) -------------
  const handleAddIncome = () => {
    if (!incomeAmount) {
      setToast({
        show: true,
        message: "أدخل قيمة الدخل أولاً",
        variant: "danger",
      });
      return;
    }

    showConfirm(
      `CAHT: هل تريد فعلاً إضافة الدخل بقيمة ${incomeAmount}?`,
      async () => {
        try {
          const res = await axiosInstance.post("/income/add", {
            MonthlyIncome: parseInt(incomeAmount),
            comment: incomeComment || "Salary",
          });
          if (res.data?.status?.status) {
            await fetchDashboard();
            setIncomeComment("");
            setIncomeAmount("");
            setShowIncome(false);
            setToast({
              show: true,
              message: "تم إضافة الدخل بنجاح!",
              variant: "success",
            });
          } else {
            throw new Error("Failed");
          }
        } catch (err) {
          console.error(err);
          setToast({
            show: true,
            message: "حدث خطأ أثناء إضافة الدخل",
            variant: "danger",
          });
        }
      }
    );
  };

  // ------------ Add Expense (uses CAHT confirm) -------------
  const handleAddExpense = () => {
    if (!expenseAmount || !expenseCategory) {
      setToast({
        show: true,
        message: "املأ بيانات المصروف كاملة",
        variant: "danger",
      });
      return;
    }

    showConfirm(
      `CAHT: هل تريد فعلاً إضافة هذا المصروف بقيمة ${expenseAmount}?`,
      async () => {
        try {
          const res = await axiosInstance.post("/expenses/add", {
            amount: parseInt(expenseAmount),
            description: expenseDesc || "Misc",
            category: expenseCategory,
          });
          if (res.data?.status?.status) {
            await fetchDashboard();
            setExpenseDesc("");
            setExpenseAmount("");
            setExpenseCategory("");
            setShowExpense(false);
            setToast({
              show: true,
              message: "تم إضافة المصروف بنجاح!",
              variant: "success",
            });
          } else {
            throw new Error("Failed");
          }
        } catch (err) {
          console.error(err);
          setToast({
            show: true,
            message: "حدث خطأ أثناء إضافة المصروف",
            variant: "danger",
          });
        }
      }
    );
  };

  // ------------ Export functions -------------
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(filteredIncome),
      "Income"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(filteredExpense),
      "Expenses"
    );
    XLSX.writeFile(wb, "Financial_Report.xlsx");
    setToast({ show: true, message: "تم تصدير Excel", variant: "success" });
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Expenses Report", 14, 16);

    const tableColumn = ["Category", "Amount", "Description", "Date"];
    const tableRows = [];

    // استخدم filteredExpense بدل expenses للتوافق مع الكود الحالي
    filteredExpense.forEach((exp) => {
      const expData = [
        exp.category,
        exp.amount,
        exp.description,
        exp.date ? new Date(exp.date).toLocaleDateString() : "-",
      ];
      tableRows.push(expData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("expenses-report.pdf");

    setToast({ show: true, message: "تم تصدير PDF", variant: "success" });
  };
  const usagePercent = ((summary.expenses / budgetLimit) * 100).toFixed(1);
  const totalIncome = filteredIncome.reduce(
    (sum, i) => sum + (i.MonthlyIncome || 0),
    0
  );
  const totalExpense = filteredExpense.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const finalBalance = totalIncome - totalExpense;
  const topExpenses = [...filteredExpense]
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 3);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // toggle dark mode by adding class to body (simple)
  useEffect(() => {
    document.body.classList.toggle("caht-dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`container mt-4 caht-dashboard ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">
            {getGreeting()} {username ? `${username}!` : "!"}
          </h3>
          <small className="text-muted">{new Date().toLocaleString()}</small>
        </div>

        <div className="d-flex align-items-center">
          <Button
            variant={darkMode ? "light" : "secondary"}
            className="me-2"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "وضع فاتح" : "وضع داكن"}
          </Button>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <div className="small mt-2">جلب البيانات ...</div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="d-flex justify-content-between my-4 flex-wrap caht-cards">
        <Card className="text-center p-3 m-1 flex-fill">
          <div className="d-flex align-items-center justify-content-center">
            <span className="me-2">💰</span>
            <div>
              <h6>Total Income</h6>
              <h4>
                ${<CountUp end={summary.income} duration={1} separator="," />}
              </h4>
            </div>
          </div>
        </Card>
        <Card className="text-center p-3 m-1 flex-fill">
          <div className="d-flex align-items-center justify-content-center">
            <span className="me-2">📉</span>
            <div>
              <h6>Total Expenses</h6>
              <h4>
                ${<CountUp end={summary.expenses} duration={1} separator="," />}
              </h4>
            </div>
          </div>
        </Card>
        <Card className="text-center p-3 m-1 flex-fill">
          <div className="d-flex align-items-center justify-content-center">
            <span className="me-2">💵</span>
            <div>
              <h6>Balance</h6>
              <h4>
                ${<CountUp end={summary.balance} duration={1} separator="," />}
              </h4>
            </div>
          </div>
        </Card>
      </div>
      {/* Alerts */}
      {/* {totalExpense > budgetLimit && (
        <div className="alert alert-danger">
          ⚠️ You have exceeded your budget limit!
        </div>
      )}
      {finalBalance > 2000 && (
        <div className="alert alert-success">
          🎉 Great! You are saving money efficiently.
        </div>
      )} */}

      {/* Budget Section (Enhanced Design) */}
      <div className="budget-section mb-4 p-3 rounded shadow-sm">
        {/* الحالة أو الرسالة */}
        <div className="status-card mb-3 d-flex align-items-center">
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            {finalBalance > 2000
              ? "🎯 Great! You are saving money efficiently."
              : "💡 حاول التحكم بمصروفاتك لتوفير أفضل."}
          </span>
        </div>

        <div className="d-flex justify-content-between flex-wrap align-items-center">
          {/* Budget Progress */}
          <div style={{ minWidth: 260 }}>
            <h6 className="fw-bold mb-2">💰 Budget Usage</h6>
            <ProgressBar
              now={((totalExpense / budgetLimit) * 100).toFixed(1)}
              label={`${((totalExpense / budgetLimit) * 100).toFixed(1)}%`}
              variant={totalExpense > budgetLimit ? "danger" : "info"}
              style={{ height: "20px", borderRadius: "10px" }}
            />
          </div>

          {/* Buttons */}
          <div className="dashboard-buttons mt-3 d-flex align-items-center flex-wrap">
            <Button
              variant="success"
              className="me-2 mb-2"
              onClick={() => setShowIncome(true)}
            >
              ➕ Add Income
            </Button>
            <Button
              variant="danger"
              className="me-2 mb-2"
              onClick={() => setShowExpense(true)}
            >
              ➖ Add Expense
            </Button>
            <Form.Select
              className="me-2 mb-2"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ width: "150px", borderRadius: "8px" }}
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
            <Button variant="info" className="me-2 mb-2" onClick={exportExcel}>
              📊 Export Excel
            </Button>
            <Button variant="secondary" className="mb-2" onClick={exportPDF}>
              🧾 Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Modals (simple inline modals) */}
      {showIncome && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Income</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowIncome(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Comment"
                  value={incomeComment}
                  onChange={(e) => setIncomeComment(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowIncome(false)}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={handleAddIncome}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExpense && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Expense</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowExpense(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Description"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Category"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowExpense(false)}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={handleAddExpense}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Income Table */}
      <h4>Income</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Comment</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncome.map((inc, idx) => (
            <tr key={idx} style={{ backgroundColor: "#e6ffe6" }}>
              <td>{inc.date || "-"}</td>
              <td>{inc.comment}</td>
              <td>${inc.MonthlyIncome}</td>
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
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpense.map((exp, idx) => (
            <tr key={idx} style={{ backgroundColor: "#ffe6e6" }}>
              <td>{exp.date}</td>
              <td>{exp.description}</td>
              <td>{exp.category}</td>
              <td>${exp.amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">
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
          {<CountUp end={finalBalance} duration={1} separator="," />}
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
          <div className="mt-3">
            <h6>نصيحة ذكية</h6>
            <div className="small text-muted">{getSmartTip()}</div>
          </div>
        </div>
      </div>

      {/* Top 3 Expenses */}
      <div className="mt-4">
        <h5>Top 3 Expenses</h5>
        <ListGroup>
          {topExpenses.map((exp, idx) => {
            const percent = ((exp.amount / budgetLimit) * 100).toFixed(1);
            return (
              <ListGroup.Item key={idx}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{exp.description}</span>
                  <span>${exp.amount}</span>
                </div>
                <ProgressBar
                  now={percent}
                  label={`${percent}%`}
                  variant="danger"
                />
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>

      {/* CAHT Confirm (Chat-style) */}
      {confirm.show && (
        <div className="confirm-toast">
          <div className="confirm-message">{confirm.message}</div>
          <div className="confirm-buttons">
            <button className="btn btn-success me-2" onClick={handleConfirmYes}>
              نعم
            </button>
            <button className="btn btn-danger" onClick={handleConfirmNo}>
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Inline Notification (Toast-like chat bubble) */}
      <InlineNotification
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
}
