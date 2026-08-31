import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useRef } from 'react';
import { NU_GOLD, NU_NAVY, NU_NAVY_DARK } from '../../theme';

const ReportsPage = () => {
  const printRef = useRef(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) return;

    const headMarkup = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((node) => node.outerHTML)
      .join('');

    const exportedAt = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date());

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Print Report</title>
          ${headMarkup}
        </head>
        <body>
          <main class="report-shell">
            <header class="report-header">
              <h1>NU Bulldogs Exchange — Reports Summary</h1>
              <p>Prepared on ${exportedAt}</p>
            </header>
            <section class="report-content">
              ${printContent.outerHTML}
            </section>
          </main>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: NU_NAVY_DARK }}>
          Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sales and category performance overview for NU Bulldogs Exchange merchandise.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        <Button variant="contained" color="primary">Generate</Button>
        <Button variant="outlined" onClick={handlePrint}>
          Export
        </Button>
      </Stack>

      <Stack ref={printRef} spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: NU_NAVY_DARK }}>
              Monthly Sales by Category: March 2026 – August 2026
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Illustrative sales trend across the 3 NU Bulldogs Exchange merchandise categories.
              Connect this to real order data once enough sales history has accumulated.
            </Typography>

            <BarChart
              series={[
                {
                  data: [12000, 15000, 14000, 17000, 19000, 21000],
                  label: 'Daily Essentials',
                  color: NU_NAVY,
                },
                {
                  data: [9000, 11000, 10500, 13000, 14500, 16000],
                  label: 'Study Supplies',
                  color: NU_GOLD,
                },
                {
                  data: [18000, 20000, 19500, 22000, 25000, 27000],
                  label: 'Campus Apparel',
                  color: '#7c8fd6',
                },
              ]}
              height={400}
              xAxis={[
                {
                  data: ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'],
                  scaleType: 'band',
                  label: 'Month',
                },
              ]}
              stack
            />
          </CardContent>
        </Card>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: NU_NAVY_DARK }}>
                Sales Share by Category
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Illustrative breakdown of revenue share across Daily Essentials, Study Supplies,
                and Campus Apparel.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: 32, label: 'Daily Essentials', color: NU_NAVY },
                        { id: 1, value: 24, label: 'Study Supplies', color: NU_GOLD },
                        { id: 2, value: 44, label: 'Campus Apparel', color: '#7c8fd6' },
                      ],
                      arcLabel: (item) => `${item.value}%`,
                      arcLabelRadius: '65%',
                      arcLabelStyle: {
                        fontSize: 12,
                        fill: '#fff',
                        fontWeight: 'bold',
                      },
                    },
                  ]}
                  width={400}
                  height={300}
                  margin={{ top: 30, bottom: 30, left: 30, right: 30 }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: NU_NAVY_DARK }}>
                Top Selling Items
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Illustrative best sellers this term, based on units sold.
              </Typography>
              <BarChart
                layout="horizontal"
                series={[{ data: [58, 47, 41, 33, 29], color: NU_NAVY }]}
                yAxis={[
                  {
                    data: [
                      'NU Bulldogs Statement Shirt',
                      'NU Bulldogs Tumbler',
                      'NU Bulldogs Varsity Jacket',
                      'NU Bulldogs Notebook Set',
                      'NU Bulldogs Lanyard',
                    ],
                    scaleType: 'band',
                  },
                ]}
                height={280}
                margin={{ left: 180 }}
              />
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ReportsPage;
