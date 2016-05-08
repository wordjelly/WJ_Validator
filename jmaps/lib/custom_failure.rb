class CustomFailure < Devise::FailureApp
  def redirect_url
  	 puts "the request referrer is: #{request.referrer}"
  	 puts "the flash request type is"
  	 puts flash[:request_type]
	 
     flash[:failure_message] = i18n_message
  	 
     #if flash[:request_type] == "oauth"
  		#oauth_sign_in_failed_users_path 	
  	 #else
  	 	#sign_in_failed_users_path
  	 #end

     new_user_session_path

  end

  # You need to override respond to eliminate recall
  def respond
    puts "this should call the redirect url"
    redirect
  end


end