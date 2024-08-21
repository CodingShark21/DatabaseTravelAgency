package edu.iitkgp.softengsem4;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import edu.iitkgp.softengsem4.common.Constants;

import org.json.JSONObject;

//@X is an annotation. 
@CrossOrigin
@RestController
public class APIController {
	@Autowired
	private DataSource postgreDS;
	private static String SQL_QUERY_TESTTABLE = "select * from testtable";
	private static String SQL_QUERY_TEST_CREATE = """ 
			 insert into testtable
			 (ID,DESCR)
			 values('21CS10055','Roddur')
			""";
	private static String SQL_QUERY_TEST_DELETE = "delete from testtable where DESCR = 'Roddur'";
	private static String SQL_QUERY_TEST_UPDATE = """
			update testtable
			set DESCR = 'Aditya' 
			where ID = '21CS10051'
			""";
	private final String SQL_QUERY_USER_BY_ID_PWD = "select UserId, Role from UserMaster where Status = 'A' and UserID = ? and Password = ?";
	private final String SQL_QUERY_SEARCH_TAXI = "select vehregID ,model from vehicle_details where AC = ?";
	String req = "AC_preference : true";
	@GetMapping(value = "/api/Hello")
	public ResponseEntity<String> sayHelloWorld(){
		return new ResponseEntity<String> ("Hello World! ",HttpStatus.OK);
	}
	
	@GetMapping(value = "/api/testtable")
	public ResponseEntity<String> getTestTableRows(){
		try(Connection conn = postgreDS.getConnection();
				PreparedStatement stmt = conn.prepareStatement(SQL_QUERY_TESTTABLE);){
			stmt.execute();
			ResultSet rs = stmt.getResultSet();
			StringBuilder strb = new StringBuilder();
			if(rs != null){
				while(rs.next()) {
					strb.append(rs.getString("ID"));
					strb.append(",");
					strb.append(rs.getString("DESCR"));
					strb.append("\n");
				}
			}
			return new ResponseEntity<String> (strb.toString(),HttpStatus.OK);
		}
		catch(Exception x) {
			return new ResponseEntity<String> (x.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping(value = "/api/testtable")
	public ResponseEntity<String> addTestTableRow(){
		try(Connection conn = postgreDS.getConnection();
				PreparedStatement stmt = conn.prepareStatement(SQL_QUERY_TEST_CREATE);){
			stmt.execute();
			return new ResponseEntity<String> ("Added",HttpStatus.CREATED);
		}
		catch(Exception x) {
			return new ResponseEntity<String> (x.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@DeleteMapping(value = "/api/testtable")
	public ResponseEntity<String> deleteTableRow(){
		try(Connection conn = postgreDS.getConnection();
				PreparedStatement stmt = conn.prepareStatement(SQL_QUERY_TEST_DELETE);){
			stmt.execute();
			return new ResponseEntity<String> ("Deleted",HttpStatus.OK);
		}
		catch(Exception x) {
			return new ResponseEntity<String> (x.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping(value = "/api/testtable")
	public ResponseEntity<String> updateTableRow(){
		try(Connection conn = postgreDS.getConnection();
				PreparedStatement stmt = conn.prepareStatement(SQL_QUERY_TEST_UPDATE);){
			stmt.execute();
			return new ResponseEntity<String> ("Updated",HttpStatus.OK);
		}
		catch(Exception x) {
			return new ResponseEntity<String> (x.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping(value = "/api/validateLogin")
	public ResponseEntity<String> validateLogin(@RequestBody String req){
		System.out.println(req);
		
		JSONObject reqjson = new JSONObject(req);
		String userId = reqjson.optString(Constants.JSON_PROP_LOGIN_USER,"");
		String password = reqjson.optString(Constants.JSON_PROP_LOGIN_PASSWORD,"");
		try ( Connection conn = postgreDS.getConnection();
				PreparedStatement stmt = conn.prepareStatement(SQL_QUERY_USER_BY_ID_PWD);) {
			
			// Set SQL query execution parameters		
			stmt.setString(1, userId);
			stmt.setString(2, password);
			
			// Run SQL query and retrieve results
			stmt.execute();
			ResultSet rs = stmt.getResultSet();
			
			// If no results were returned by the query, return null
			if (rs == null || rs.next() == false) {
				return new ResponseEntity<String> (String.format(Constants.STATUS_ERROR, "\"Invalid User Id or Password\""), HttpStatus.UNAUTHORIZED);
			}
			
			// Marshall table row to JSON format
			JSONObject userJson = new JSONObject();
			userJson.put(Constants.JSON_PROP_USER_ID, rs.getString(Constants.COL_USER_ID));
			userJson.put(Constants.JSON_PROP_ROLE, rs.getString(Constants.COL_ROLE));
			return new ResponseEntity<String> (userJson.toString(),HttpStatus.OK);
		}
		catch (Exception x) {
			x.printStackTrace();
			return new ResponseEntity<String> (String.format(Constants.STATUS_ERROR, x.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping(value = "/api/getTaxi")
	public ResponseEntity<String> getTaxi(@RequestBody String req){
		System.out.println(req);
		JSONObject reqjson = new JSONObject(req);
		boolean AC = Boolean.parseBoolean(reqjson.optString(Constants.JSON_PROP_USER_AC,""));
		try ( Connection conn = postgreDS.getConnection();
				PreparedStatement stmt = conn.prepareStatement(SQL_QUERY_SEARCH_TAXI);) {
			
			// Set SQL query execution parameters		
			stmt.setBoolean(1, AC);
			
			// Run SQL query and retrieve results
			stmt.execute();
			ResultSet rs = stmt.getResultSet();
			
			// If no results were returned by the query, return null
			if (rs == null || rs.next() == false) {
				return new ResponseEntity<String> (String.format(Constants.STATUS_ERROR, "\"Invalid User Id or Password\""), HttpStatus.UNAUTHORIZED);
			}
			
			// Marshall table row to JSON format
			JSONObject userJson = new JSONObject();
			userJson.put(Constants.JSON_PROP_USER_CARNAME, rs.getString(Constants.CAR_NAME));
			userJson.put(Constants.JSON_PROP_USER_CARREGID, rs.getString(Constants.CAR_REG_ID));
			System.out.println(userJson);
			return new ResponseEntity<String> (userJson.toString(),HttpStatus.OK);
		}
		catch (Exception x) {
			x.printStackTrace();
			return new ResponseEntity<String> (String.format(Constants.STATUS_ERROR, x.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
