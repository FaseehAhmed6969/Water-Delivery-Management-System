import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

// Generate Daily Report PDF
export const generateDailyReport = (orders, revenue) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(20);
    doc.text('AquaFlow Water Delivery', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Daily Report - ${today}`, 105, 25, { align: 'center' });

    // Summary
    doc.setFontSize(12);
    doc.text(`Total Orders: ${orders.length}`, 20, 40);
    doc.text(`Total Revenue: ₹${revenue}`, 20, 50);
    doc.text(`Delivered: ${orders.filter(o => o.status === 'delivered').length}`, 20, 60);
    doc.text(`Pending: ${orders.filter(o => o.status === 'pending').length}`, 20, 70);

    // Orders Table
    const tableData = orders.map(order => [
        order._id.slice(-6),
        order.customerId?.name || 'N/A',
        order.items.map(i => `${i.quantity}x ${i.bottleSize}`).join(', '),
        `₹${order.totalPrice}`,
        order.status
    ]);

    doc.autoTable({
        head: [['Order ID', 'Customer', 'Items', 'Amount', 'Status']],
        body: tableData,
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [0, 123, 255] }
    });

    doc.save(`daily-report-${today}.pdf`);
};

// Generate Monthly Report PDF
export const generateMonthlyReport = (orders, revenue, startDate, endDate) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('AquaFlow Water Delivery', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Monthly Report`, 105, 25, { align: 'center' });
    doc.text(`${startDate} to ${endDate}`, 105, 32, { align: 'center' });

    // Monthly Summary
    doc.setFontSize(12);
    doc.text(`Total Orders: ${orders.length}`, 20, 45);
    doc.text(`Total Revenue: ₹${revenue}`, 20, 55);
    doc.text(`Average Order Value: ₹${(revenue / orders.length).toFixed(2)}`, 20, 65);
    doc.text(`Completed Orders: ${orders.filter(o => o.status === 'delivered').length}`, 20, 75);

    // Orders by Date
    const tableData = orders.map(order => [
        new Date(order.createdAt).toLocaleDateString(),
        order._id.slice(-6),
        order.customerId?.name || 'N/A',
        `₹${order.totalPrice}`,
        order.status
    ]);

    doc.autoTable({
        head: [['Date', 'Order ID', 'Customer', 'Amount', 'Status']],
        body: tableData,
        startY: 85,
        theme: 'striped',
        headStyles: { fillColor: [40, 167, 69] }
    });

    doc.save(`monthly-report-${startDate}-to-${endDate}.pdf`);
};

// Export Orders to CSV
export const exportOrdersToCSV = (orders) => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Items', 'Amount', 'Status', 'Date', 'Payment Method'];

    const csvData = orders.map(order => [
        order._id,
        order.customerId?.name || 'N/A',
        order.customerId?.phone || 'N/A',
        order.items.map(i => `${i.quantity}x ${i.bottleSize}`).join('; '),
        order.totalPrice,
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
        order.paymentMethod || 'COD'
    ]);

    let csv = headers.join(',') + '\n';
    csvData.forEach(row => {
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
};

// Export Revenue Report to CSV
export const exportRevenueToCSV = (revenueData) => {
    const headers = ['Date', 'Total Revenue', 'Order Count', 'COD', 'Easypaisa', 'JazzCash', 'Bank'];

    const csvData = revenueData.map(day => [
        day.date,
        day.totalRevenue,
        day.orderCount,
        day.cod || 0,
        day.easypaisa || 0,
        day.jazzcash || 0,
        day.bank || 0
    ]);

    let csv = headers.join(',') + '\n';
    csvData.forEach(row => {
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `revenue-report-${new Date().toISOString().split('T')[0]}.csv`);
};
