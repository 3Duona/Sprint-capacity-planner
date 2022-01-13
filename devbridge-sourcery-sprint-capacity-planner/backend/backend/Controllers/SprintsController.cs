using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DataAccess.Contracts.Sprints;
using backend.DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SprintsController : ControllerBase
    {
        private readonly SprintRepository _sprints;
        public SprintsController(SprintRepository sprints)
        {
            _sprints = sprints;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Cookies")]
        public async Task<List<SprintDto>> GetSprints()
        {
            return await _sprints.GetSprints();
        }

        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = "Cookies")]
        public async Task<ActionResult> GetSprint([FromRoute] int id)
        {
            try
            {
                return Ok(await _sprints.GetSprint(id));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Cookies")]
        public async Task<ActionResult> CreateSprint([FromBody] CreateSprintRequest request)
        {
            try
            {
                return Created("", await _sprints.AddSprint(request));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = "Cookies")]
        public async Task<ActionResult> EditSprint([FromRoute] int id, [FromBody] UpdateSprintRequest request)
        {
            try
            {
                return Ok(await _sprints.UpdateSprint(id, request));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = "Cookies")]
        public async Task<ActionResult> DeleteSprint([FromRoute] int id)
        {
            try
            {
                return Ok(await _sprints.DeleteSprint(id));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
