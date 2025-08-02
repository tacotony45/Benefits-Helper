let chart; // Will hold Chart.js instance

document.getElementById('benefitsForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const salary = Number(document.getElementById('salary').value);
  const familySize = Number(document.getElementById('familySize').value);
  const planType = document.getElementById('planType').value;

  const planData = {
    hmo: { premiumPerPerson: 3000, deductible: 1500 },
    ppo: { premiumPerPerson: 4000, deductible: 1000 },
    hdhp: { premiumPerPerson: 2500, deductible: 3500 },
  };

  const plan = planData[planType];
  const estimatedPremium = plan.premiumPerPerson * familySize;
  const estimatedOutOfPocket = plan.deductible * familySize;
  const totalEstimatedCost = estimatedPremium + estimatedOutOfPocket;
  const percentOfSalary = ((totalEstimatedCost / salary) * 100).toFixed(2);

  // Show the text results
  document.getElementById('premiumText').innerText = `Premium: $${estimatedPremium.toLocaleString()}`;
  document.getElementById('oopText').innerText = `Estimated Out-of-Pocket: $${estimatedOutOfPocket.toLocaleString()}`;
  document.getElementById('totalText').innerText = `Total Estimated Cost: $${totalEstimatedCost.toLocaleString()}`;
  document.getElementById('percentText').innerText = `This is approximately ${percentOfSalary}% of your annual salary.`;

  // Questions for enrollment
  const questions = [
    "Does this plan cover my preferred doctors and hospitals?",
    "What are the co-pay amounts for primary and specialist visits?",
    "Are prescription drugs covered, and at what cost?",
    "What mental health services are included?",
    "Is telemedicine covered under this plan?",
  ];
  document.getElementById('questionsList').innerHTML = questions.map(q => `<li>${q}</li>`).join('');

  // Show the results section
  document.getElementById('result').classList.remove('hidden');

  // Draw the pie chart
  const ctx = document.getElementById('costChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Premium', 'Out-of-Pocket'],
      datasets: [{
        data: [estimatedPremium, estimatedOutOfPocket],
        backgroundColor: ['#4CAF50', '#FF9800'],
      }]
    }
  });

  // Export to PDF
  document.getElementById('exportPDF').onclick = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Benefits Enrollment Helper Results", 10, 10);
    doc.setFontSize(12);
    doc.text(`Premium: $${estimatedPremium.toLocaleString()}`, 10, 25);
    doc.text(`Out-of-Pocket: $${estimatedOutOfPocket.toLocaleString()}`, 10, 35);
    doc.text(`Total Estimated Cost: $${totalEstimatedCost.toLocaleString()}`, 10, 45);
    doc.text(`Percent of Salary: ${percentOfSalary}%`, 10, 55);

    doc.text("Questions to Ask:", 10, 70);
    questions.forEach((q, i) => {
      doc.text(`- ${q}`, 10, 80 + i * 10);
    });

    doc.save("Benefits-Helper-Results.pdf");
  };
});
