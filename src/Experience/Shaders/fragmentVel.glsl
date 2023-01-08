uniform vec3 force;

vec3 applyForce(vec3 acc, vec3 force)
{
    return acc + force;
}

vec3 updateForce(vec3 vel, vec3 acc)
{
   vel += acc;
   acc = vec3(0.0,0.0,0.0);

   return vel;
}



void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;


    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz;

    vec4 tmpAcc = texture2D( textureAcceleration, uv );
    vec3 acc = tmpAcc.xyz;
   
    float friction = 0.986;

   
    vel += acc;
    pos += vel;


     if(pos.y <= -3.0)
      {
     
        vel.y *= -0.85;
        vel.x = vel.x * friction;
        vel.z = vel.z * friction;
      }     


     if(pos.x >= 6.0)
    {
       
        vel.x *= -0.8;
       
    }

     if(pos.x <= -6.0)
    {
      
        vel.x *= -0.8;
    }

     if(pos.z>= 6.0)
    {
      
        vel.z *= -0.8;
    }

     if(pos.z <= -6.0)
    {
       
        vel.z *= -0.8;
    }



    gl_FragColor = vec4( vel, 1.0 );

}