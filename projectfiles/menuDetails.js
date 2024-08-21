import { Component } from "react";
import viewDetailsButton from './images/icons8-search-24.png'

var configSettings = require('./config/configSettings.js');
var config = configSettings.config;

class menuDetails extends Component {

	state = {
		vehicles: []
	}

	componentDidMount() {
		if (this.props.detailsType === "vehicle") {
			this.loadVehicles();
		}
		else{
			if(this.props.detailsType === "booking"){
				console.log("In booking");
				this.makeBooking();
			}
		}
	}

	inspectDetails(evt) {
		var buttonId = evt.target.id;
		var button = document.getElementById(buttonId);

		if (! button.style.background || button.style.background === "none") {
				button.style.background = "darkgrey";
				button.style.border = "1px solid";
		}
		else {
			button.style.background = "none";
			button.style.border = "none";
		}
		
		var detailsDiv = null;
		if (buttonId === "showTransactions") {
			detailsDiv = document.getElementById("xactions");
		}
		else if (buttonId === "showDisbursements") {
			detailsDiv = document.getElementById("disbursements");
		}

		if (detailsDiv != null) {
			detailsDiv.style.display = (detailsDiv.style.display === 'block') ? 'none' : 'block';
		}
	} 

	loadVehicles() {
		fetch(`${config.baseURL}/api/vehicle`, 
			{
				method: 'GET',
				mode: 'cors'
			}
		)
		.then((response) => {
			if (response.status !== 200) {
				console.error('MenuDetails.loadVehicles(): API call not successful!');
			}
			else {
				response.json().then((data) => {
					this.setState(
						{
							vehicles: data
						}
					);
				});
			}
		});
	}

	makeBooking(){
		fetch(`${config.baseURL}/api/booking`, 
			{
				method: 'GET',
				mode: 'cors'
			}
		)
		.then((response) => {
			if (response.status !== 200) {
				console.error('MenuDetails.makeBooking(): API call not successful!');
			}
			else {
				response.json().then((data) => {
					console.log("Bookings: " + JSON.stringify(data));
					this.setState(
						{
							bookings: data
						}
					);
				});
			}
		});
		/*return(
			<div id = "Booking_Form">
			<p>BOOK A RIDE</p>
			<form>
			<label>Source</label>
			<select>
				<option>Mumbai,MH</option>
				<option>Delhi,NCR</option>
				<option>Bangalore,KA</option>
				<option>Kolkata,WB</option>
				<option>Hyderabad,AP</option>
				<option>Pune,MH</option>
			</select>
			<label>Destination</label>
			<select>
				<option>Mumbai,MH</option>
				<option>Delhi,NCR</option>
				<option>Bangalore,KA</option>
				<option>Kolkata,WB</option>
				<option>Hyderabad,AP</option>
				<option>Pune,MH</option>
			</select>
			</form>
			</div>
		)*/
	}

	renderDefault() {
		return (
			<h3 className="centeredMessage">Select from the list in left panel to view details here.</h3>
		);
	}

	formatNumberWithSeparators(num) {
		var numParts = num.split('.');
		var formattedNum = (numParts.length > 1) ? `.${numParts[1]}` : '';
		var numOfDigits = 3;
		var remainingLength = numParts[0].length;

		while (remainingLength > numOfDigits) {
			formattedNum = `,${numParts[0].slice((remainingLength - numOfDigits), remainingLength)}${formattedNum}`;
			remainingLength -= numOfDigits;
			numOfDigits = 2;
		}

		return `${numParts[0].slice(0, remainingLength)}${formattedNum}`;
	}

	newbooking(evt)
	{
		console.log("Function called");
		return(
			<div id = "Booking_Form">
			<p>BOOK A RIDE</p>
			<form>
			<label>Source</label>
			<select>
				<option>Mumbai,MH</option>
				<option>Delhi,NCR</option>
				<option>Bangalore,KA</option>
				<option>Kolkata,WB</option>
				<option>Hyderabad,AP</option>
				<option>Pune,MH</option>
			</select>
			<label>Destination</label>
			<select>
				<option>Mumbai,MH</option>
				<option>Delhi,NCR</option>
				<option>Bangalore,KA</option>
				<option>Kolkata,WB</option>
				<option>Hyderabad,AP</option>
				<option>Pune,MH</option>
			</select>
			</form>
			</div>
		);
	}

	renderBooking() {
		var bookingRows = (this.state.bookings) 
								?	this.state.bookings.map((booking) => {
										return (
											<tr>
												<td className="td_nonnumeric">{booking.Source}</td>
												<td className="td_nonnumeric">{booking.Destination}</td>
												<td className="td_nonnumeric">{booking.From}</td>
												<td className="td_nonnumeric">{booking.To}</td>
												<td className="td_nonnumeric">{booking.Car_size}</td>
												<td className="td_nonnumeric">{(booking.AC) ? "YES" : "NO"}</td>
											</tr>
										);
									}) 
								: 	null;
		return (
			<div id="bookingsList">
				<h1>List of Bookings</h1>
				<button name = "button" value = "OK" onClick = {this.newbooking.bind(this)}>CLICK FOR NEW BOOKING</button>
				<table id="disbTable1">
					<thead>
						<tr>
							<th>Source</th>
							<th>Destination</th>
							<th>From Date</th>
							<th>To Date</th>
							<th>Car Size</th>
							<th>AC</th>
						</tr>
					</thead>
					<tbody>
						{bookingRows}
					</tbody>
				</table>
			</div>
		);
	}

	renderVehicles(){
		var vehicleRows = (this.state.vehicles) 
								?	this.state.vehicles.map((vehicle) => {
										return (
											<tr>
												<td className="td_nonnumeric">{vehicle.registrationId}</td>
												<td className="td_nonnumeric">{vehicle.make}</td>
												<td className="td_nonnumeric">{vehicle.model}</td>
												<td className="td_nonnumeric">{vehicle.sizeType}</td>
												<td className="td_nonnumeric">{vehicle.fuelType}</td>
												<td className="td_nonnumeric">{(vehicle.isAC) ? "YES" : "NO"}</td>
												<td className="td_numeric">{vehicle.chargePerHour.toFixed(2)}</td>
												<td className="td_numeric">{vehicle.chargePerKm.toFixed(2)}</td>
												<td className="td_nonnumeric">{vehicle.status}</td>
											</tr>
										);
									}) 
								: 	null;
		return (
			<div id="vehiclesList">
				<h1>List of Vehicles</h1>
				<table id="disbTable">
					<thead>
						<tr>
							<th>Registration#</th>
							<th>Make</th>
							<th>Model</th>
							<th>Size Type</th>
							<th>Fuel Type</th>
							<th>Is AC?</th>
							<th className="th_numeric">Charge<br></br>per Hour</th>
							<th className="th_numeric">Charge per<br></br>Kilometer</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{vehicleRows}
					</tbody>
				</table>
			</div>
		);
	}

	renderMenuDetails() {
		if (this.props.detailsType === "vehicle") {
			return this.renderVehicles();
		}
		else if(this.props.detailsType === "booking"){
			return this.renderBooking();
		}
		//else
			//return this.manageExpenses();
	}

	render() {
		const menuDetails = (this.props.detailsType) ? this.renderMenuDetails() : this.renderDefault();
        return (
			<div id="menuDetails" className="holdingDetails">
				{menuDetails}
			</div>
		);
    }
}

export default menuDetails;