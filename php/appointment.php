<?php
/**
 * Appointment Booking Handler
 * KSD Eye Clinic
 */

require_once 'config.php';

// Set JSON response header
header('Content-Type: application/json');

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Get POST data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$date = isset($_POST['date']) ? trim($_POST['date']) : '';
$time = isset($_POST['time']) ? trim($_POST['time']) : '';
$service = isset($_POST['service']) ? trim($_POST['service']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please enter a valid name';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address';
}

if (empty($phone) || !preg_match('/^[0-9]{10}$/', $phone)) {
    $errors[] = 'Please enter a valid 10-digit phone number';
}

if (empty($date)) {
    $errors[] = 'Please select an appointment date';
}

if (empty($time)) {
    $errors[] = 'Please select an appointment time';
}

// Check if date is in the future
if (!empty($date)) {
    $appointmentDate = new DateTime($date);
    $today = new DateTime();
    $today->setTime(0, 0, 0);
    
    if ($appointmentDate < $today) {
        $errors[] = 'Appointment date must be in the future';
    }
}

// Return validation errors
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please fix the following errors:',
        'errors' => $errors
    ]);
    exit();
}

// Get database connection
$conn = getDBConnection();

if (!$conn) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed. Please try again later.'
    ]);
    exit();
}

// Prepare and execute insert query
$stmt = $conn->prepare("INSERT INTO appointments (name, email, phone, appointment_date, appointment_time, service, message) VALUES (?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to prepare statement. Please try again.'
    ]);
    $conn->close();
    exit();
}

$stmt->bind_param("sssssss", $name, $email, $phone, $date, $time, $service, $message);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Appointment booked successfully! We will contact you soon.',
        'appointment_id' => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to book appointment. Please try again.'
    ]);
}

$stmt->close();
$conn->close();
?>
