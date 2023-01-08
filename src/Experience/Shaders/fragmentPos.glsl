uniform float timer;
uniform float delta;

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;

    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz;

    vec4 tmpAcc = texture2D( textureAcceleration, uv );
    vec3 acc = tmpAcc.xyz;
 

    vel += acc;
    pos += vel;
   
    if(pos.y <= -3.0)
      {
        pos.y = -3.0;
     
      }     


    if(pos.x >= 6.0)
    {
        pos.x = 6.0;
      
       
    }

     if(pos.x <= -6.0)
    {
        pos.x = -6.0;
      
    }

     if(pos.z>= 6.0)
    {
        pos.z = 6.0;
      
    }

     if(pos.z <= -6.0)
    {
        pos.z = -6.0;
       
    }


    gl_FragColor = vec4( pos, 1.0 );

}