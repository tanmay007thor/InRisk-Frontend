import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import axios from "axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineController,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "../css/weather.css";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineController,
  zoomPlugin
);

const WeatherForm = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState([]);
  const [temperature, setTemperature] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [alert, setalert] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [formVisible, setFormVisible] = useState(true);

  const chartRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude || !startDate || !endDate) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://archive-api.open-meteo.com/v1/archive",
        {
          params: {
            latitude,
            longitude,
            start_date: startDate,
            end_date: endDate,
            hourly: "temperature_2m",
          },
        }
      );

      const times = response.data.hourly.time.map((timeStr) => {
        const date = new Date(timeStr);
        return date.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      });

      const temperatures = response.data.hourly.temperature_2m;
      const formattedDates = response.data.hourly.time.map((timeStr) => {
        const date = new Date(timeStr);
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      });

      setTime(times);
      setTemperature(temperatures);
      setDates(formattedDates);
      setalert(false);
      setLoading(false);
      setFormVisible(false);
    } catch (error) {
      console.error(
        "Error fetching weather data:",
        error?.response?.statusText
      );
      setError(error?.response?.statusText);
      setLoading(false);
      setalert(true);
    }
  };

  useEffect(() => {
    if (!chartRef.current || !dates.length || !temperature.length) return;

    const ctx = chartRef.current.getContext("2d");

    const data = {
      labels: dates,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperature,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.1,
        },
      ],
    };

    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 14,
              },
            },
          },
          title: {
            display: true,
            text: "Temperature Over Time",
            font: {
              size: 20,
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            titleColor: "#fff",
            bodyColor: "#fff",
            callbacks: {
              label: (tooltipItem) => {
                return `Temperature: ${tooltipItem.raw}°C`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time (Hours)",
              font: {
                size: 14,
              },
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 7,
            },
          },
          y: {
            title: {
              display: true,
              text: "Temperature (°C)",
              font: {
                size: 14,
              },
            },
            beginAtZero: false,
            ticks: {
              maxTicksLimit: 5,
            },
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "xy",
          },
          zoom: {
            enabled: true,
            mode: "xy",
            speed: 0.1,
          },
        },
      },
    };

    const chartInstance = new ChartJS(ctx, config);

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [dates, temperature]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenForm = () => {
    setFormVisible(true);
    setLatitude("");
    setLongitude("");
    setStartDate("");
    setEndDate("");
    setTime([]);
    setTemperature([]);
    setDates([]);
    setPage(0);
    setError(null);
    setalert(null);
  };

  return (
    <Container className="weather-form-container">
      <Stack sx={{ width: "100%" }} spacing={2}>
        {alert === true && (
          <Alert severity="error">
            Error fetching weather data. Please check the latitude, longitude,
            or date range.
          </Alert>
        )}
        {alert === false && (
          <Alert severity="success">Weather data loaded successfully!</Alert>
        )}
      </Stack>

      {formVisible && (
        <Card sx={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Weather Data Form
          </Typography>
          <form onSubmit={handleSubmit} className="w-full">
            <Grid container spacing={2} className="form-row">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Latitude"
                  type="number"
                  fullWidth
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Longitude"
                  type="number"
                  fullWidth
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {loading ? (
                  <Stack sx={{ color: "grey.500" }} spacing={2} direction="row">
                    <CircularProgress color="secondary" />
                  </Stack>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                    }}
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Card>
      )}

      {!formVisible && (
        <div style={{ marginTop: 20 }}>
          <Typography variant="h3">Weather Data</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time (AM/PM)</TableCell>
                  <TableCell>Temperature (°C)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((date, index) => (
                    <TableRow key={index}>
                      <TableCell>{date}</TableCell>
                      <TableCell>{time[index]}</TableCell>
                      <TableCell>{temperature[index]}°C</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={dates.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>

          {/* Chart rendered using React hooks */}
          <div className="chart-container">
            <canvas ref={chartRef} className="canvas" />
          </div>

          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Button
              variant="contained"
              sx={{ width: "100%", padding: "12px", borderRadius: "12px" }}
              onClick={handleOpenForm}
            >
              Open Form Again
            </Button>
          </Box>
        </div>
      )}
    </Container>
  );
};

export default WeatherForm;
