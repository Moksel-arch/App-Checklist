document.addEventListener("DOMContentLoaded", () => {
  const table = $("#results-table").DataTable({
    dom: "Bfrtip",
    buttons: ["csvHtml5", "excelHtml5", "pdfHtml5", "print"],
  });

  const submitBtn = document.getElementById("submit-btn");
  const clearBtn = document.getElementById("clear-btn");
  const restartBtn = document.getElementById("restart-btn");
  const checklistForm = document.getElementById("checklist-form");

  // Accordion toggle
  document.querySelectorAll(".accordion").forEach(button => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      button.nextElementSibling.classList.toggle("show");
    });
  });

  function updateSummary() {
    let data = table.rows().data().toArray();
    let passed = 0, failed = 0, critical = 0, major = 0, minor = 0;

    data.forEach(row => {
      let status = row[5];
      let severity = row[6];
      if (status.includes("Passed")) passed++;
      if (status.includes("Failed")) failed++;
      if (severity.includes("Critical")) critical++;
      if (severity.includes("Major")) major++;
      if (severity.includes("Minor")) minor++;
    });

    document.getElementById("summary-row").innerHTML =
      `✅ Passed: ${passed} | ❌ Failed: ${failed} | 🔴 Critical: ${critical} | 🟠 Major: ${major} | 🟢 Minor: ${minor}`;
  }

  submitBtn.addEventListener("click", () => {
    const inspector = document.getElementById("inspector-name").value.trim();
    const link = document.getElementById("app-link").value.trim();
    const feedback = document.getElementById("feedback-text").value.trim();
    const timestamp = new Date().toLocaleString();

    if (!inspector || !link) {
      alert("Inspector name and App link are required.");
      return;
    }

    const items = checklistForm.querySelectorAll(".checklist-item");

    items.forEach((item) => {
      const cb = item.querySelector("input[type=checkbox]");
      const severity = item.querySelector(".severity").value;
      const category = item.getAttribute("data-category");
      const label = cb.parentElement.textContent.trim();

      const status = cb.checked
        ? `<span class="status-passed">✓ Passed</span>`
        : `<span class="status-failed">✗ Failed</span>`;

      const linkHtml = `<a href="${link}" target="_blank" style="color:#FFD700">${link}</a>`;
      const severityClass = severity === "Critical" ? "severity-critical" :
                            severity === "Major" ? "severity-major" : "severity-minor";
      const severityHtml = `<span class="${severityClass}">${severity}</span>`;

      table.row.add([
        inspector,
        timestamp,
        linkHtml,
        category,
        label,
        status,
        severityHtml,
        (feedback || "No feedback")
      ]).draw();
    });

    updateSummary();
  });

  clearBtn.addEventListener("click", () => {
    checklistForm.reset();
    document.getElementById("inspector-name").value = "";
    document.getElementById("app-link").value = "";
    document.getElementById("feedback-text").value = "";
    table.clear().draw();
  });

  restartBtn.addEventListener("click", () => {
    window.location.reload();
  });
});
