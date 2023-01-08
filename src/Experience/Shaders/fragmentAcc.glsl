

vec3 applyForce(vec3 acc, vec3 force)
{
    return acc + force;
}


void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

   vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;


    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz;

    vec4 tmpAcc = texture2D( textureAcceleration, uv );
    vec3 acc = tmpAcc.xyz;
    
   
    // vel += acc;
    // pos += vel;


    gl_FragColor = vec4( acc, 1.0 );

}